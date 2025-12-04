import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.createBook(dto);
  }

  @Get()
  findAll() {
    return this.booksService.getBooks();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.getBookById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.updateBook(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }
}
