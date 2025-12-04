import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BorrowService {
  constructor(private readonly prisma: PrismaService) {}

  async borrowBook(dto: BorrowBookDto) {
    // Check if book is already borrowed
    const book = await this.prisma.book.findUnique({
      where: { id: dto.bookId },
    });
    if (!book) throw new Error('Book not found');
    if (book.isBorrowed) throw new Error('Book already borrowed');

    // Mark book as borrowed
    await this.prisma.book.update({
      where: { id: dto.bookId },
      data: { isBorrowed: true },
    });

    // Create borrow record
    return this.prisma.borrow.create({
      data: { userId: dto.userId, bookId: dto.bookId },
    });
  }

  async returnBook(bookId: string) {
    const borrowRecord = await this.prisma.borrow.findFirst({
      where: { bookId, returnedAt: null },
    });
    if (!borrowRecord) throw new Error('Book not currently borrowed');

    // Mark book as returned
    await this.prisma.book.update({
      where: { id: bookId },
      data: { isBorrowed: false },
    });

    // Update borrow record
    return this.prisma.borrow.update({
      where: { id: borrowRecord.id },
      data: { returnedAt: new Date() },
    });
  }

  async getUserBorrowedBooks(userId: string) {
    return this.prisma.borrow.findMany({
      where: { userId, returnedAt: null },
      include: { book: true },
    });
  }
}
