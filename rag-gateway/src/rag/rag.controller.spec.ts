// ✅ Test: RAGService (rag.service.spec.ts)
import { Test, TestingModule } from '@nestjs/testing';
import { RAGService } from './rag.service';
import { RAGController } from './rag.controller';


describe('RAGController', () => {
  let controller: RAGController;
  let service: RAGService;

  const mockService = {
    handleRagFlow: jest.fn().mockResolvedValue({
      answer: 'Mocked Answer',
      context: 'Mocked Context'
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RAGController],
      providers: [
        { provide: RAGService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<RAGController>(RAGController);
    service = module.get<RAGService>(RAGService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.handleRagFlow and return result', async () => {
    const body = { sessionId: 'abc123', question: 'What is RAG?' };
    const result = await controller.ask(body);
    expect(service.handleRagFlow).toHaveBeenCalledWith('abc123', 'What is RAG?');
    expect(result).toEqual({ answer: 'Mocked Answer', context: 'Mocked Context' });
  });
});
