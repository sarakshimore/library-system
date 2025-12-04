import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post('borrow')
  borrowBook(@Body() dto: BorrowBookDto) {
    return this.borrowService.borrowBook(dto);
  }

  @Post('return')
  returnBook(@Body('bookId') bookId: string) {
    return this.borrowService.returnBook(bookId);
  }

  @Get('users/:userId/borrowed')
  getUserBorrowed(@Param('userId') userId: string) {
    return this.borrowService.getUserBorrowedBooks(userId);
  }
}
