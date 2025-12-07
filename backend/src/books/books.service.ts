import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  createBook(dto: CreateBookDto, adminId: string) {
    return this.prisma.book.create({
      data: {
        ...dto,
        adminId, // Add adminId to the create data
      },
    });
  }

  getBooks(adminId: string) {
    return this.prisma.book.findMany({
      where: { adminId }, // Filter by adminId
      include: { author: true },
    });
  }

  getBookById(id: string, adminId: string) {
    return this.prisma.book.findUnique({
      where: { id, adminId }, // Ensure admin owns this book
      include: { author: true },
    });
  }

  updateBook(id: string, dto: UpdateBookDto, adminId: string) {
    return this.prisma.book.update({
      where: { id, adminId }, // Ensure admin owns this book
      data: dto,
    });
  }

  deleteBook(id: string, adminId: string) {
    return this.prisma.book.delete({
      where: { id, adminId }, // Ensure admin owns this book
    });
  }
}
