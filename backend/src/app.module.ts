import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { BorrowModule } from './borrow/borrow.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AuthorsModule,
    BooksModule,
    BorrowModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
