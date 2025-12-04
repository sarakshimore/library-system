import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create User (Protected)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  // Get All Users (Protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.getAllUsers();
  }
}
