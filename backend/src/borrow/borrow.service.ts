import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BorrowService {
  constructor(private readonly prisma: PrismaService) {}

  async borrowBook(dto: BorrowBookDto, adminId: string) {
    // Check if book exists and belongs to admin
    const book = await this.prisma.book.findFirst({
      where: { id: dto.bookId, adminId },
    });
    if (!book) throw new NotFoundException('Book not found');
    if (book.isBorrowed) throw new BadRequestException('Book already borrowed');

    // Check if user exists and belongs to admin
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, adminId },
    });
    if (!user) throw new NotFoundException('User not found');

    // Mark book as borrowed
    await this.prisma.book.update({
      where: { id: dto.bookId },
      data: { isBorrowed: true },
    });

    // Create borrow record with optional dueAt
    return this.prisma.borrow.create({
      data: {
        userId: dto.userId,
        bookId: dto.bookId,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
      },
      include: {
        book: true,
        user: true,
      },
    });
  }

  async returnBook(borrowId: string, adminId: string) {
    // Find borrow record and verify admin ownership through relations
    const borrowRecord = await this.prisma.borrow.findFirst({
      where: {
        id: borrowId,
        returnedAt: null,
        book: { adminId }, // Verify through book relation
      },
      include: { book: true },
    });

    if (!borrowRecord)
      throw new NotFoundException('Active borrow record not found');

    // Mark book as returned
    await this.prisma.book.update({
      where: { id: borrowRecord.bookId },
      data: { isBorrowed: false },
    });

    // Update borrow record
    return this.prisma.borrow.update({
      where: { id: borrowRecord.id },
      data: { returnedAt: new Date() },
      include: {
        book: true,
        user: true,
      },
    });
  }

  async getAllBorrows(adminId: string) {
    return this.prisma.borrow.findMany({
      where: {
        returnedAt: null, // Only active borrows
        book: { adminId }, // Filter by admin through book relation
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: true,
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async getUserBorrowedBooks(userId: string, adminId: string) {
    // Verify user belongs to admin
    const user = await this.prisma.user.findFirst({
      where: { id: userId, adminId },
    });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.borrow.findMany({
      where: { userId, returnedAt: null },
      include: {
        book: {
          include: {
            author: true,
          },
        },
      },
    });
  }
}
