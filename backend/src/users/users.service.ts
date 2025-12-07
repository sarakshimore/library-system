import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Add this import

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateUserDto, adminId: string) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        adminId,
      },
    });
  }

  findAll(adminId: string) {
    return this.prisma.user.findMany({
      where: { adminId },
      include: {
        _count: {
          select: { borrows: true },
        },
      },
    });
  }

  // ADD THIS METHOD
  update(id: string, dto: UpdateUserDto, adminId: string) {
    return this.prisma.user.update({
      where: { id, adminId }, // Ensure admin owns this user
      data: dto,
    });
  }

  remove(id: string, adminId: string) {
    return this.prisma.user.delete({
      where: { id, adminId },
    });
  }
}
