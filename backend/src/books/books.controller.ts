import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookDto, @Request() req) {
    const adminId = req.user.adminId; // Changed from userId
    return this.booksService.createBook(dto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const adminId = req.user.adminId; // Changed from userId
    return this.booksService.getBooks(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const adminId = req.user.adminId; // Changed from userId
    return this.booksService.getBookById(id, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto, @Request() req) {
    const adminId = req.user.adminId; // Changed from userId
    return this.booksService.updateBook(id, dto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const adminId = req.user.adminId; // Changed from userId
    return this.booksService.deleteBook(id, adminId);
  }
}
