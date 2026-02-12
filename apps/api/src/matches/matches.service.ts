import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Match, Prisma } from '@prisma/client';
import { AiService } from '../ai/ai.service'; // Import AiService
import { HOBBY_MAPPING } from '@sibom/shared';

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(data: Prisma.MatchCreateInput): Promise<Match> {
    return this.prisma.match.create({ data });
  }

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  async getRecommendations(
    userId: string,
    ageMin?: number,
    ageMax?: number,
    ageMax?: number,
    distance?: string,
    location?: string,
    interestCodes?: string[],
    skipAi: boolean = false,
  ) {
    // 1. Get Current User Profile
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    const todayDate = this.getTodayDateString();

    // Determine if we need to BYPASS daily cache
    // If ANY filter is active, we should NOT use the daily cache because proper filtering is more important
    const isFiltering =
      ageMin ||
      ageMax ||
      (location) ||
      (distance && distance !== 'nationwide') ||
      (interestCodes && interestCodes.length > 0);

    let targetIds: string[] = [];
    let cachedReasons: Record<string, string> = {};

    // 2. DAILY RECOMMENDATION LOGIC (Only if NOT filtering)
    if (!isFiltering) {
      const dailyRec = await this.prisma.dailyRecommendation.findUnique({
        where: {
          userId_date: {
            userId,
            date: todayDate,
          },
        },
      });

      if (dailyRec) {
        targetIds = dailyRec.recommendedIds;
        // Load cached AI reasons
        if (dailyRec.metadata && typeof dailyRec.metadata === 'object') {
          cachedReasons = dailyRec.metadata as Record<string, string>;
        }
        console.log(
          `[Cache HIT] Using cached recommendations for ${userId} on ${todayDate}`,
        );
      }
    }

    // 3. GENERATE OR FETCH CANDIDATES
    // If filtering OR no daily recs, fetch fresh candidates matching criteria
    if (targetIds.length === 0) {
      // Find existing interactions (Matches) to exclude
      const existingMatches = await this.prisma.match.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      const excludedIds = existingMatches.reduce(
        (acc, match) => {
          acc.push(
            match.senderId === userId ? match.receiverId : match.senderId,
          );
          return acc;
        },
        [userId],
      );

      // Construct Filter Where Clause
      const whereClause: Prisma.ProfileWhereInput = {
        userId: { notIn: excludedIds },
      };

      // Age Filter (Calculate Birth Year)
      const currentYear = new Date().getFullYear();
      if (ageMin || ageMax) {
        whereClause.birthYear = {};
        if (ageMin) whereClause.birthYear.lte = currentYear - ageMin; // Older = Smaller Year
        if (ageMax) whereClause.birthYear.gte = currentYear - ageMax;
      }

      // Location/Distance Filter
      if (location) {
        whereClause.location = { startsWith: location };
      } else if (distance && distance !== 'nationwide') {
        // Treat as "Same Region" since we lack geo-coords
        whereClause.location = userProfile.location;
      }

      // Interest Filter
      if (interestCodes && interestCodes.length > 0) {
        whereClause.interests = {
          hasSome: interestCodes,
        };
      }

      // Fetch a larger pool of candidates for randomization
      const allCandidates = await this.prisma.profile.findMany({
        where: whereClause,
        take: 50, // Fetch larger pool to enable random selection
      });

      // Shuffle candidates randomly using Fisher-Yates algorithm
      const shuffledCandidates = [...allCandidates];
      for (let i = shuffledCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCandidates[i], shuffledCandidates[j]] = [
          shuffledCandidates[j],
          shuffledCandidates[i],
        ];
      }

      // Take required number from shuffled list
      const candidates = shuffledCandidates.slice(0, isFiltering ? 20 : 9);

      console.log(
        `Found ${allCandidates.length} total candidates, selected ${candidates.length} randomly with filters:`,
        {
          ageMin,
          ageMax,
          distance,
          location,
          interestCodes,
        },
      );

      targetIds = candidates.map((c) => c.userId);
    }

    if (targetIds.length === 0) {
      return [];
    }

    // 4. Fetch Profiles & Filter out already acted upon
    const actedMatches = await this.prisma.match.findMany({
      where: {
        senderId: userId,
        receiverId: { in: targetIds },
      },
      select: { receiverId: true },
    });

    const actedIds = actedMatches.map((m) => m.receiverId);
    const finalIds = targetIds.filter((id) => !actedIds.includes(id));

    if (finalIds.length === 0) {
      return [];
    }

    const profiles = await this.prisma.profile.findMany({
      where: { userId: { in: finalIds } },
    });

    console.log('Score Calculation Start:', new Date().toISOString());
    const startTime = performance.now();

    // 4. 규칙 기반 점수 계산 (동기, 즉시)
    const translateInterests = (codes: string[]) =>
      codes.map((code) => HOBBY_MAPPING[code] || code);

    const userProfileForAI = {
      ...userProfile,
      interests: translateInterests(userProfile.interests),
    };

    const scoredProfiles = profiles.map((candidate) => {
      const candidateInterests = translateInterests(candidate.interests);
      return {
        ...candidate,
        interests: candidateInterests,
        score: this.calculateRuleBasedScore(userProfile, candidate),
      };
    });

    const scoreEndTime = performance.now();
    console.log(
      `Rule-based Score Duration: ${(scoreEndTime - startTime).toFixed(0)}ms`,
    );

    // 5. AI 배치 호출 - 캐시 미스 시에만 호출
    let reasons: Record<string, string> = cachedReasons;

    // Check if we have cached reasons for all profiles
    const missingReasonIds = scoredProfiles
      .filter((p) => !reasons[p.userId])
      .map((p) => p.userId);

    if (!skipAi && missingReasonIds.length > 0) {
      console.log('AI Batch Call Start:', new Date().toISOString());
      const aiStartTime = performance.now();

      const candidatesForAI = scoredProfiles
        .filter((p) => missingReasonIds.includes(p.userId))
        .map((p) => ({
          userId: p.userId,
          name: p.name,
          bio: p.bio,
          interests: p.interests,
          location: p.location,
        }));

      const newReasons = await this.aiService.generateMatchReasonsBatch(
        userProfileForAI,
        candidatesForAI,
      );

      // Merge new reasons with cached
      reasons = { ...reasons, ...newReasons };

      const aiEndTime = performance.now();
      console.log('AI Batch Call End:', new Date().toISOString());
      console.log(
        `AI Batch Duration: ${(aiEndTime - aiStartTime).toFixed(0)}ms`,
      );

      // Save to DailyRecommendation cache if not filtering
      if (!isFiltering) {
        await this.prisma.dailyRecommendation.upsert({
          where: {
            userId_date: {
              userId,
              date: todayDate,
            },
          },
          update: {
            recommendedIds: targetIds,
            metadata: reasons,
          },
          create: {
            userId,
            date: todayDate,
            recommendedIds: targetIds,
            metadata: reasons,
          },
        });
        console.log(
          `[Cache SAVE] Saved recommendations for ${userId} on ${todayDate}`,
        );
      }
    } else if (Object.keys(cachedReasons).length > 0) {
      console.log('Using cached AI reasons, skipping AI call.');
    } else {
      console.log('Skipping AI generation as requested.');
    }

    const aiEndTime = performance.now(); // Ensure defined for total duration log
    console.log(`Total Duration: ${(aiEndTime - startTime).toFixed(0)}ms`);

    // 6. 결과 조합
    const recommendations = scoredProfiles.map((candidate) => ({
      id: candidate.userId,
      name: candidate.name,
      age: new Date().getFullYear() - candidate.birthYear,
      location: candidate.location,
      imageUrl: candidate.images[0] || 'https://via.placeholder.com/400',
      quote: candidate.bio || '안녕하세요!',
      interests: candidate.interests,
      matchReason:
        reasons[candidate.userId] || '관심사와 활동 지역이 잘 맞는 분이에요!', // Fallback reason
      score: candidate.score,
    }));

    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * 규칙 기반 매칭 점수 계산
   */
  private calculateRuleBasedScore(
    userProfile: { interests: string[]; birthYear: number; location: string },
    candidateProfile: {
      interests: string[];
      birthYear: number;
      location: string;
    },
  ): number {
    let score = 50; // 기본 점수

    // 1. 공통 관심사 점수 (최대 +30점)
    const commonInterests = userProfile.interests.filter((i: string) =>
      candidateProfile.interests.includes(i),
    );
    score += Math.min(commonInterests.length * 10, 30);

    // 2. 지역 일치 점수 (+15점)
    if (userProfile.location === candidateProfile.location) {
      score += 15;
    }

    // 3. 나이대 유사성 (+5점) - 10살 이내
    const ageDiff = Math.abs(
      userProfile.birthYear - candidateProfile.birthYear,
    );
    if (ageDiff <= 10) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  async like(senderId: string, receiverId: string) {
    const todayDate = new Date();
    const startOfDay = new Date(todayDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(todayDate.setHours(23, 59, 59, 999));

    console.log(`[MatchesService] Like request: ${senderId} -> ${receiverId}`);

    // 0. Check if already interacted (I already liked/passed them)
    const existingInteraction = await this.prisma.match.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });

    if (existingInteraction) {
      return {
        message: 'Already interacted',
        status: existingInteraction.status,
      };
    }

    // 1. Check for REVERSE match (Did they already like me?)
    const reverseMatch = await this.prisma.match.findUnique({
      where: {
        senderId_receiverId: {
          senderId: receiverId,
          receiverId: senderId,
        },
      },
    });

    // If they already liked me (PENDING), just accept their match - don't create a new one
    if (reverseMatch && reverseMatch.status === 'PENDING') {
      await this.prisma.$transaction([
        this.prisma.match.update({
          where: { id: reverseMatch.id },
          data: { status: 'ACCEPTED' },
        }),
        // Notify both
        this.prisma.notification.create({
          data: {
            userId: senderId,
            type: 'MATCH',
            content: '축하합니다! 새로운 매칭이 성사되었습니다.',
            metadata: { partnerId: receiverId },
          },
        }),
        this.prisma.notification.create({
          data: {
            userId: receiverId,
            type: 'MATCH',
            content: '축하합니다! 새로운 매칭이 성사되었습니다.',
            metadata: { partnerId: senderId },
          },
        }),
      ]);

      return {
        success: true,
        isMatch: true,
        matchId: reverseMatch.id,
        message: '매칭 성공!',
      };
    }

    // 2. Check Daily Like Limit (Max 3) - only count new likes I initiate
    const dailyLikeCount = await this.prisma.match.count({
      where: {
        senderId: senderId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['PENDING', 'ACCEPTED'],
        },
      },
    });

    if (dailyLikeCount >= 3) {
      throw new BadRequestException('DAILY_LIKE_LIMIT_EXCEEDED');
    }

    // 3. Create new Like (PENDING) - I'm initiating first
    const newMatch = await this.prisma.match.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING',
      },
    });

    // Notify receiver
    await this.prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MATCH',
        content: '누군가 당신에게 관심을 보냈습니다!',
        metadata: { senderId },
      },
    });

    return {
      success: true,
      isMatch: false,
      matchId: newMatch.id,
      message: '관심을 보냈어요!',
    };
  }

  async pass(senderId: string, receiverId: string) {
    console.log(`[MatchesService] Pass request: ${senderId} -> ${receiverId}`);
    // Create REJECTED match so we don't recommend them again
    await this.prisma.match.create({
      data: {
        senderId,
        receiverId,
        status: 'REJECTED',
      },
    });
    return { success: true, message: '다음에 뵙기로 해요.' };
  }

  async getReceivedLikes(userId: string) {
    // Get likes received by me (PENDING or ACCEPTED where I am receiver)
    const received = await this.prisma.match.findMany({
      where: {
        receiverId: userId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
      include: {
        sender: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // For PENDING likes, filter out those I already acted on
    const myActions = await this.prisma.match.findMany({
      where: {
        senderId: userId,
        receiverId: { in: received.map((r) => r.senderId) },
      },
      select: { receiverId: true },
    });

    const myActionReceiverIds = new Set(myActions.map((a) => a.receiverId));

    // Filter: Only show PENDING that I haven't acted on, plus all ACCEPTED
    const finalReceived = received.filter(
      (r) => r.status === 'ACCEPTED' || !myActionReceiverIds.has(r.senderId),
    );

    return finalReceived
      .map((match) => {
        const p = match.sender.profile;
        if (!p) return null;

        return {
          id: match.senderId,
          matchId: match.id,
          name: p.name,
          age: new Date().getFullYear() - p.birthYear,
          location: p.location,
          imageUrl: p.images[0] || 'https://via.placeholder.com/400',
          interests: p.interests.map((code) => HOBBY_MAPPING[code] || code),
          bio: p.bio,
          status: match.status,
          receivedAt: match.createdAt,
        };
      })
      .filter(Boolean);
  }

  async getSentLikes(userId: string) {
    const sent = await this.prisma.match.findMany({
      where: {
        senderId: userId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
      include: {
        receiver: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sent
      .map((match) => {
        const p = match.receiver.profile;
        if (!p) return null;

        return {
          id: match.receiverId,
          matchId: match.id,
          name: p.name,
          age: new Date().getFullYear() - p.birthYear,
          location: p.location,
          imageUrl: p.images[0] || 'https://via.placeholder.com/400',
          status: match.status, // PENDING or ACCEPTED
          sentAt: match.createdAt,
        };
      })
      .filter(Boolean);
  }

  async report(reporterId: string, targetId: string, reason: string) {
    return this.prisma.report.create({
      data: {
        reporterId,
        targetId,
        reason,
      },
    });
  }

  async block(blockerId: string, blockedId: string) {
    // 1. Create Block record
    await this.prisma.block.upsert({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
      update: {},
      create: {
        blockerId,
        blockedId,
      },
    });

    // 2. Cancel any existing match between them
    await this.prisma.match.updateMany({
      where: {
        OR: [
          { senderId: blockerId, receiverId: blockedId },
          { senderId: blockedId, receiverId: blockerId },
        ],
      },
      data: {
        status: 'CANCELLED',
      },
    });

    return { success: true };
  }

  async leaveChat(userId: string, matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) throw new Error('Match not found');
    if (match.senderId !== userId && match.receiverId !== userId) {
      throw new Error('Unauthorized');
    }

    return this.prisma.match.update({
      where: { id: matchId },
      data: { status: 'CANCELLED' },
    });
  }
}
