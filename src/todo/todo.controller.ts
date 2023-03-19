import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/_authStrategies/jwtDecorator';
import { TodoService } from './todo.service';
import { createTodo, deleteTodo, updateTodo } from './_dto/todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}
  @Get('listTodos')
  async getTodos(@User() user, @Query('filter') filter) {
    return await this.todoService.getTodos(user.user_id, filter);
  }

  @Post('createTodo')
  async createTodo(@User() user, @Body() body: createTodo) {
    return await this.todoService.createTodo(user.user_id, body.content);
  }

  @Post('markTodoCompleted')
  async markTodoCompleted(@User() user, @Body() body: updateTodo) {
    return await this.todoService.updateTodo(user.user_id, body.todo_id, true);
  }

  @Post('markTodoUncompleted')
  async markTodoUncompleted(@User() user, @Body() body: updateTodo) {
    return await this.todoService.updateTodo(user.user_id, body.todo_id, false);
  }

  @Post('deleteTodo')
  async deleteTodo(@User() user, @Body() body: deleteTodo) {
    return await this.todoService.deleteTodo(user.user_id, body.todo_id);
  }
}
