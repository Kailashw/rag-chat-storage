// ✅ Test: RAGService (rag.service.spec.ts)
import { Test, TestingModule } from '@nestjs/testing';
import { RAGService } from './rag.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

const dummyAxiosConfig: InternalAxiosRequestConfig = {
  headers: new AxiosHeaders(),
  method: 'post',
  url: '',
};

describe('RAGService', () => {
  let service: RAGService;
  let httpService: HttpService;

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockConfigService = {
    get: (key: string) => {
      const config = {
        PYTHON_RETRIEVER_URL: 'http://retriever',
        GROQ_API_KEY: 'fake-key',
        STORAGE_API_KEY: 'storage-api',
        STORAGE_API_URL: 'http://backend'
      };
      return config[key];
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RAGService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RAGService>(RAGService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should fetch context from retriever', async () => {
    const contextResponse: AxiosResponse = {
      data: { documents: [['Paris is in France.']] },
      status: 200, statusText: 'OK', headers: {}, config: dummyAxiosConfig
    };

    mockHttpService.post.mockReturnValueOnce(of(contextResponse));
    const context = await service['getContext']('Where is Paris?');
    expect(context).toContain('Paris is in France.');
  });

  it('should generate a response from Groq', async () => {
    const groqResponse: AxiosResponse = {
      data: { choices: [{ message: { content: 'It is in France.' } }] },
      status: 200, statusText: 'OK', headers: {}, config: dummyAxiosConfig
    };

    mockHttpService.post.mockReturnValueOnce(of(groqResponse));
    const answer = await service['queryGroq']('Where is Paris?', 'Paris is in France.');
    expect(answer).toBe('It is in France.');
  });

  it('should log user and assistant messages to storage', async () => {
    const logResponse: AxiosResponse = {
      data: { success: true },
      status: 201, statusText: 'Created', headers: {}, config: dummyAxiosConfig
    };

    mockHttpService.post.mockReturnValue(of(logResponse));
    const log = await service['logToStorage']('session-1', 'Q', 'A', 'ctx');
    expect(mockHttpService.post).toHaveBeenCalledTimes(4);
  });

  it('should run handleRagFlow and return answer/context', async () => {
    const ctxResp: AxiosResponse = {
      data: { documents: [['Eiffel Tower is in Paris']] },
      status: 200, statusText: 'OK', headers: {}, config: dummyAxiosConfig
    };
    const groqResp: AxiosResponse = {
      data: { choices: [{ message: { content: 'It is in Paris' } }] },
      status: 200, statusText: 'OK', headers: {}, config: dummyAxiosConfig
    };
    const logResp: AxiosResponse = {
      data: {},
      status: 200, statusText: 'OK', headers: {}, config: dummyAxiosConfig
    };

    mockHttpService.post
      .mockReturnValueOnce(of(ctxResp))
      .mockReturnValueOnce(of(groqResp))
      .mockReturnValue(of(logResp));

    const result = await service.handleRagFlow('session-123', 'Where is Eiffel Tower?');
    expect(result.answer).toContain('Paris');
    expect(result.context).toContain('Eiffel Tower');
  });
});
