import { PrismaModule } from '@app/prisma';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: path.resolve('.env'),
    }),
    PrismaModule,
    UserModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaModule],
})
export class AppModule {}
