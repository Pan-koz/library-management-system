import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    try {
      return await this.prisma.book.create({
        data: createBookDto,
        include: { genre: true },
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(genreId?: number, search?: string) {
    return this.prisma.book.findMany({
      where: {
        ...(genreId ? { genreId } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { genre: true },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found.`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    try {
      return await this.prisma.book.update({
        where: { id },
        data: updateBookDto,
        include: { genre: true },
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }

  private handleDatabaseError(error: unknown): never {
    const code = (error as { code?: string })?.code;

    if (code === 'P2002') {
      throw new ConflictException('A book with this ISBN already exists.');
    }

    if (code === 'P2003') {
      throw new BadRequestException('The supplied genre ID is invalid.');
    }

    throw error;
  }
}
