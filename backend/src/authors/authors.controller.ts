import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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
  create(@Body() dto: CreateAuthorDto) {
    return this.authorsService.create(dto);
  }

  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
  return this.authorsService.update(id, dto);
}


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
