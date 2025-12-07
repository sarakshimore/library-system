import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch, // Add this import
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Add this import
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateUserDto, @Request() req) {
    const adminId = req.user.adminId;
    return this.usersService.create(dto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const adminId = req.user.adminId;
    return this.usersService.findAll(adminId);
  }

  // ADD THIS METHOD
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req) {
    const adminId = req.user.adminId;
    return this.usersService.update(id, dto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const adminId = req.user.adminId;
    return this.usersService.remove(id, adminId);
  }
}
