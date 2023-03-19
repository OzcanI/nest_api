import { PrismaService } from '@app/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TodoService {
  constructor(private prismaService: PrismaService) {}

  public async getTodos(user_id: number, filter = 'all') {
    const where = {
      user_id: user_id,
    };
    if (filter == 'completed' || filter == 'incompleted') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where.completed = filter == 'completed' ? true : false;
    }
    const todos = await this.prismaService.toDos.findMany({
      where,
    });
    return todos;
  }

  public async createTodo(user_id: number, content: string) {
    const todo = await this.prismaService.toDos.create({
      data: {
        content,
        user_id,
      },
    });
    return todo;
  }

  public async updateTodo(
    user_id: number,
    todo_id: string,
    completed: boolean,
  ) {
    if (
      !(await this.prismaService.toDos.findFirst({
        where: { todo_id: Number(todo_id), user_id },
      }))
    ) {
      throw new NotFoundException('Todo Not Found');
    }
    await this.prismaService.toDos.update({
      where: {
        todo_id: Number(todo_id),
      },
      data: {
        completed,
      },
    });
  }

  public async deleteTodo(user_id: number, todo_id: string) {
    if (
      !(await this.prismaService.toDos.findFirst({
        where: { todo_id: Number(todo_id), user_id },
      }))
    ) {
      throw new NotFoundException('Todo Not Found');
    }
    await this.prismaService.toDos.delete({
      where: {
        todo_id: Number(todo_id),
      },
    });
  }
}
