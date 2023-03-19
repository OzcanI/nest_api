import { PrismaService } from '@app/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';

const mockPrismaService = {
  toDos: {
    findMany: (query) => {
      return [
        {
          user_id: 1,
          todoText: 'todo',
        },
      ];
    },
  },
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getTodos should exists and work properly', async () => {
    expect(service.getTodos).toBeDefined();

    const result = await service.getTodos({ user_id: 1 });
    expect(result).toStrictEqual(
      mockPrismaService.toDos.findMany({ user_id: 1 }),
    );
  });
});
