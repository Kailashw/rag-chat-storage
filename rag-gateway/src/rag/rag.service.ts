import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RAGService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService
  ) {}

  async handleRagFlow(sessionId: string, question: string) {
    const context = await this.getContext(question);
    const answer = await this.queryGroq(question, context);
    await this.logToStorage(sessionId, question, answer, context);

    return { answer, context };
  }

  private async getContext(question: string): Promise<string> {
    const retrieverURL = this.config.get('PYTHON_RETRIEVER_URL');

    const response = await firstValueFrom(
      this.http.post(`${retrieverURL}/query`, {
        query: question,
        top_k: 3,
      })
    );

    return response.data.documents.join('\n');
  }

  private async queryGroq(question: string, context: string): Promise<string> {
    const groqKey = this.config.get('GROQ_API_KEY');

    const payload = {
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'Use the context below to answer.' },
        { role: 'user', content: `${context}\n\nQ: ${question}\nA:` },
      ],
    };

    const response = await firstValueFrom(
      this.http.post('https://api.groq.com/openai/v1/chat/completions', payload, {
        headers: {
          Authorization: `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
      })
    );

    return response.data.choices[0].message.content;
  }

  private async logToStorage(sessionId: string, user: string, bot: string, context: string) {
    const baseUrl = this.config.get('STORAGE_API_URL');
    const apiKey = this.config.get('STORAGE_API_KEY');

    await Promise.all([
      this.http.post(`${baseUrl}/messages`, {
        sessionId,
        sender: 'user',
        content: user,
      }, {
        headers: { 'x-api-key': apiKey }
      }).toPromise(),

      this.http.post(`${baseUrl}/messages`, {
        sessionId,
        sender: 'assistant',
        content: bot,
        context,
      }, {
        headers: { 'x-api-key': apiKey }
      }).toPromise()
    ]);
  }
}
