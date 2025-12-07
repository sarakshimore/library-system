import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAuthorDto, adminId: string) {
    return this.prisma.author.create({
      data: {
        ...dto,
        adminId, // Add adminId to the create data
      },
    });
  }

  async findAll(adminId: string) {
    const authors = await this.prisma.author.findMany({
      where: { adminId }, // Filter by adminId
      include: {
        books: true,
        _count: {
          select: { books: true },
        },
      },
    });

    console.log('Authors with books:', JSON.stringify(authors, null, 2));
    return authors;
  }

  update(id: string, dto: UpdateAuthorDto, adminId: string) {
    return this.prisma.author.update({
      where: { id, adminId }, // Ensure admin owns this author
      data: dto,
    });
  }

  remove(id: string, adminId: string) {
    return this.prisma.author.delete({
      where: { id, adminId }, // Ensure admin owns this author
    });
  }
}
