import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.prisma.message.create({ data });
  }

  async getRooms(userId: string) {
    // 1. Find all accepted matches where user is a participant
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: 'ACCEPTED',
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                receiverId: userId, // Count messages SENT TO me
                readAt: null,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return matches
      .map((match) => {
        const isSender = match.senderId === userId;
        const partner = isSender ? match.receiver : match.sender;
        const partnerProfile = partner.profile;

        if (!partnerProfile) return null;

        const lastMessage = match.messages[0];

        return {
          id: match.id, // This is the Room ID
          partnerId: partner.id,
          partnerName: partnerProfile.name,
          partnerImage:
            partnerProfile.images[0] || 'https://via.placeholder.com/400',
          lastMessage: lastMessage
            ? lastMessage.content
            : '대화를 시작해보세요!',
          lastMessageAt: lastMessage ? lastMessage.createdAt : match.createdAt,
          unreadCount: match._count.messages,
        };
      })
      .filter(Boolean);
  }

  async getMessages(matchId: string, userId: string) {
    // 1. Verify access
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });

    if (!match) throw new Error('Match not found');
    if (match.senderId !== userId && match.receiverId !== userId) {
      throw new Error('Unauthorized');
    }

    // 2. Fetch messages
    const messages = await this.prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
    });

    // 3. Mark as read (async)
    // Update all messages where matchId = matchId AND receiverId = userId AND readAt = null
    await this.prisma.message.updateMany({
      where: {
        matchId,
        receiverId: userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return {
      matchId: match.id,
      partner:
        match.senderId === userId
          ? match.receiver.profile
          : match.sender.profile,
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        createdAt: m.createdAt,
        isMine: m.senderId === userId,
      })),
    };
  }

  async sendMessage(userId: string, matchId: string, content: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });
    if (!match) throw new Error('Match not found');

    const receiverId =
      match.senderId === userId ? match.receiverId : match.senderId;

    // Create message
    const message = await this.prisma.message.create({
      data: {
        matchId,
        senderId: userId,
        receiverId, // derived from match
        content,
      },
    });

    // Create notification for receiver
    const senderProfile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { name: true },
    });

    await this.prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE',
        content: `${senderProfile?.name || '누군가'}님이 메시지를 보냈습니다.`,
        metadata: { matchId, senderId: userId },
      },
    });

    // Update match timestamp to sort rooms by recent activity
    await this.prisma.match.update({
      where: { id: matchId },
      data: { updatedAt: new Date() },
    });

    return message;
  }
}
