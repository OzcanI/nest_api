import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createTodo {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class updateTodo {
  @ApiProperty()
  @IsNotEmpty()
  todo_id: string;

  @ApiProperty()
  completed: boolean;
}

export class deleteTodo {
  @ApiProperty()
  @IsNotEmpty()
  todo_id: string;
}
