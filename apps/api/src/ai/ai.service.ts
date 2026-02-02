import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface UserProfile {
  name: string;
  bio?: string | null;
  interests?: string[];
  location?: string;
  userId?: string;
}

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('AI_API_KEY');
    if (!apiKey) {
      console.warn('AI_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || process.env.AI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async refineText(text: string): Promise<string> {
    try {
      const prompt = `
        You are a helpful assistant for a senior dating app.
        Your task is to refine the user's self-introduction to be more sophisticated, polite, and appealing.
        
        Strict Rules:
        1. The user is over 50 years old. Use a tone that fits this demographic: mature, dignified, and emotionally resonant (warm and sincere).
        2. Do NOT use any inappropriate words, slang, or offensive language.
        3. Keep the tone warm, sincere, and polite (Korean 'Johndaemal').
        4. Make it sound natural but polished.
        5. Do not change the meaning of the user's original text, just enhance it.
        6. Output ONLY the refined text. No explanations.
        
        User's text: "${text}"
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('AI generation failed');
    }
  }

  async calculateMatch(
    userProfile: UserProfile,
    candidateProfile: UserProfile,
  ): Promise<{ score: number; reason: string }> {
    try {
      const prompt = `
        Analyze the compatibility between these two senior users for a dating/friendship match.
        
        User A (Me):
        - Name: ${userProfile.name}
        - Bio: ${userProfile.bio}
        - Interests: ${userProfile.interests?.join(', ')}
        - Location: ${userProfile.location}

        User B (Candidate):
        - Name: ${candidateProfile.name}
        - Bio: ${candidateProfile.bio}
        - Interests: ${candidateProfile.interests?.join(', ')}
        - Location: ${candidateProfile.location}

        Task:
        1. Calculate a compatibility score from 0 to 100 based on common interests, location proximity (if inferable, otherwise ignore), and bio vibe.
        2. Write a warm, encouraging one-sentence mock "AI Match Reason" in Korean (polite tone) explaining why they might get along. 
           Example: "두 분 모두 등산을 좋아하시고, 서울에 거주하셔서 함께 산행을 즐기시기 좋습니다."

        Output Format (JSON strictly):
        {
          "score": number,
          "reason": "string"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Clean up markdown code blocks if present
      const cleanText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleanText) as { score: number; reason: string };
    } catch (error) {
      console.error('AI Matching error:', error);
      // Fallback
      return { score: 50, reason: '새로운 인연을 만들어보세요!' };
    }
  }

  /**
   * 여러 후보자에 대한 매칭 이유를 한 번의 AI 호출로 생성
   */
  async generateMatchReasonsBatch(
    userProfile: UserProfile,
    candidates: UserProfile[],
  ): Promise<Record<string, string>> {
    if (candidates.length === 0) {
      return {};
    }

    try {
      const candidatesList = candidates
        .map(
          (c, idx) =>
            `${idx + 1}. ID: ${c.userId}
   - 이름: ${c.name}
   - 소개: ${c.bio || '소개 없음'}
   - 관심사: ${c.interests?.join(', ') || '없음'}
   - 지역: ${c.location}`,
        )
        .join('\n\n');

      const prompt = `
        당신은 시니어 소개팅 앱의 AI 매칭 어시스턴트입니다.
        
        현재 사용자 정보:
        - 이름: ${userProfile.name}
        - 소개: ${userProfile.bio || '소개 없음'}
        - 관심사: ${userProfile.interests?.join(', ') || '없음'}
        - 지역: ${userProfile.location}

        아래 후보자들 각각에 대해 현재 사용자와 잘 맞을 것 같은 이유를 한 문장씩 작성해주세요.
        
        후보자 목록:
        ${candidatesList}

        규칙:
        1. 존댓말(높임말)을 사용하세요.
        2. 공통 관심사, 지역, 또는 소개글을 기반으로 따뜻하고 진심어린 톤으로 작성하세요.
        3. 각 이유는 한 문장으로 간결하게 작성하세요.
        4. 예시: "두 분 모두 등산을 좋아하셔서 함께 산행을 즐기시면 좋을 것 같아요."

        출력 형식 (JSON, 반드시 이 형식으로):
        {
          "후보자ID1": "매칭 이유",
          "후보자ID2": "매칭 이유",
          ...
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Clean up markdown code blocks if present
      const cleanText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleanText) as Record<string, string>;
    } catch (error) {
      console.error('AI Batch Matching error:', error);
      // Fallback: 모든 후보자에게 기본 이유 반환
      const fallback: Record<string, string> = {};
      candidates.forEach((c) => {
        if (c.userId) {
          fallback[c.userId] = '새로운 인연을 만들어보세요!';
        }
      });
      return fallback;
    }
  }

  async generateChatSuggestions(
    userProfile: UserProfile,
    partnerProfile: UserProfile,
    history: { sender: string; content: string }[],
    type: 'START' | 'REPLY' | 'PROPOSE' | 'EMOTION',
  ): Promise<string[]> {
    try {
      const userContext = `나(사용자): ${userProfile.name}, 관심사: ${userProfile.interests?.join(', ')}, 지역: ${userProfile.location}`;
      const partnerContext = `상대방: ${partnerProfile.name}, 관심사: ${partnerProfile.interests?.join(', ')}, 지역: ${partnerProfile.location}, 소개: ${partnerProfile.bio}`;

      let promptTask = '';
      let conversationContext = '';

      if (history.length > 0) {
        conversationContext =
          '대화 내역 (최근 순):\n' +
          history.map((h) => `${h.sender}: ${h.content}`).join('\n');
      }

      switch (type) {
        case 'START':
          promptTask = `
                상대방에게 첫 메시지를 보내려고 합니다. 
                상대방의 프로필(관심사, 지역, 소개글)을 참고하여 자연스럽고 예의 바른 첫 인사말 3가지를 추천해주세요.
                공통점이 있다면 언급해주세요.
                `;
          break;
        case 'REPLY':
          promptTask = `
                상대방의 마지막 말에 대한 자연스러운 답장 3가지를 추천해주세요.
                대화 맥락을 고려하여 질문을 포함하거나 공감을 표현하세요.
                `;
          break;
        case 'PROPOSE':
          promptTask = `
                상대방에게 오프라인 만남(차 한잔, 가벼운 식사, 취미 공유 등)을 정중하게 제안하는 메시지 3가지를 추천해주세요.
                부담스럽지 않게 표현하세요.
                `;
          break;
        case 'EMOTION':
          promptTask = `
                상대방에게 고마움, 즐거움, 위로, 칭찬 등의 따뜻한 마음을 표현하는 메시지 3가지를 추천해주세요.
                `;
          break;
      }

      const fullPrompt = `
            당신은 60대 이상 시니어들을 위한 데이팅 앱의 대화 도우미 AI입니다.
            
            [상황 정보]
            ${userContext}
            ${partnerContext}
            
            ${conversationContext}

            [요청 사항]
            ${promptTask}

            [작성 규칙]
            1. 60대 시니어의 품격 있고 정중하며 따뜻한 말투(해요체)를 사용하세요.
            2. 지나치게 젊은 은어나 과도한 이모티콘은 피하세요. (점잖은 이모티콘 1개 정도는 가능)
            3. 상대방을 배려하는 느낌을 주세요.
            4. 각 추천 문구는 쌍따옴표나 번호 없이 문장만 한 줄씩 작성해주세요.
            5. 총 3개의 제안을 줄바꿈으로 구분하여 제공하세요. (JSON 아님, plain text)
        `;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      // Split by lines and clean up
      return text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 3);
    } catch (error) {
      console.error('AI Chat Suggestion error:', error);
      return [
        '안녕하세요, 반가워요.',
        '오늘 하루는 어떠셨나요?',
        '식사는 하셨나요?',
      ];
    }
  }
}
