import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAuthorDto) {
    return this.prisma.author.create({ data: dto });
  }

  findAll() {
    return this.prisma.author.findMany();
  }

  update(id: string, dto: UpdateAuthorDto) {
    return this.prisma.author.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.author.delete({
      where: { id },
    });
  }
}
