import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  createBook(dto: CreateBookDto) {
    return this.prisma.book.create({ data: dto });
  }

  getBooks() {
    return this.prisma.book.findMany({ include: { author: true } });
  }

  getBookById(id: string) {
    return this.prisma.book.findUnique({ where: { id }, include: { author: true } });
  }

  updateBook(id: string, dto: UpdateBookDto) {
    return this.prisma.book.update({ where: { id }, data: dto });
  }

  deleteBook(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }
}
