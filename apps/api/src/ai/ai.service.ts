import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

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
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('AI generation failed');
    }
  }
}
