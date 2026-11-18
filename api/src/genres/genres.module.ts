import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller.js';
import { GenresService } from './genres.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
