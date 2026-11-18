import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({
        data: createGenreDto,
        include: { _count: { select: { books: true } } },
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAll() {
    return this.prisma.genre.findMany({
      include: { _count: { select: { books: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found.`);
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);

    try {
      return await this.prisma.genre.update({
        where: { id },
        data: updateGenreDto,
        include: { _count: { select: { books: true } } },
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      return await this.prisma.genre.delete({
        where: { id },
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    const code = (error as { code?: string })?.code;

    if (code === 'P2002') {
      throw new ConflictException('A genre with this name already exists.');
    }

    if (code === 'P2003') {
      throw new ConflictException(
        'Cannot delete this genre because books are associated with it.',
      );
    }

    throw error;
  }
}
