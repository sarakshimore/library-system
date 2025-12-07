import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAuthorDto, @Request() req) {
    const adminId = req.user.adminId; // Changed from userId to adminId
    return this.authorsService.create(dto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const adminId = req.user.adminId; // Changed from userId to adminId
    return this.authorsService.findAll(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorDto,
    @Request() req,
  ) {
    const adminId = req.user.adminId; // Changed from userId to adminId
    return this.authorsService.update(id, dto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const adminId = req.user.adminId; // Changed from userId to adminId
    return this.authorsService.remove(id, adminId);
  }
}
