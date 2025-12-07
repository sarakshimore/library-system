import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @UseGuards(JwtAuthGuard)
  @Post('borrow')
  borrowBook(@Body() dto: BorrowBookDto, @Request() req) {
    const adminId = req.user.adminId;
    return this.borrowService.borrowBook(dto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('return/:id')
  returnBook(@Param('id') borrowId: string, @Request() req) {
    const adminId = req.user.adminId;
    return this.borrowService.returnBook(borrowId, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllBorrows(@Request() req) {
    const adminId = req.user.adminId;
    return this.borrowService.getAllBorrows(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:userId/borrowed')
  getUserBorrowed(@Param('userId') userId: string, @Request() req) {
    const adminId = req.user.adminId;
    return this.borrowService.getUserBorrowedBooks(userId, adminId);
  }
}
