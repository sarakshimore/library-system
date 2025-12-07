import { IsString, IsOptional, IsDateString } from 'class-validator';

export class BorrowBookDto {
  @IsString()
  userId!: string;

  @IsString()
  bookId!: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
