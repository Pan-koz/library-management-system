# Library Management System

A NestJS backend using Prisma ORM and PostgreSQL to manage library users, books, and genres.

## Project Structure

- `api/prisma/schema.prisma` - Database models and relationships.
- `api/prisma/seed.ts` - Database seed data.
- `api/prisma/migrations/` - Database migration history.
- `api/src/prisma/prisma.service.ts` - Prisma database connection service.
- `api/.env.example` - Environment variable template.

## Database Schema

The database contains three main models:

- **User**: Stores library users and their roles.
- **Genre**: Stores book categories.
- **Book**: Stores book information and references its genre.

The Role enum defines two roles: `PATRON` and `LIBRARIAN`.

## Schema Decisions

Genre is modeled as a separate entity rather than embedding genre information directly inside each Book.

The Book model references Genre through the `genreId` foreign key:

`genre Genre @relation(fields: [genreId], references: [id])`

This relational design:

- Prevents duplication of genre information.
- Maintains referential integrity.
- Allows multiple books to belong to one genre.
- Makes genre updates easier because genre information is stored once.

## Database Migration

The database uses PostgreSQL hosted on Neon.

Run migrations:

`npx prisma migrate dev`

Generate Prisma Client:

`npx prisma generate`

## Database Seeding

Run:

`npx prisma db seed`

The seed script creates 4 genres, 16 books, and 2 users.

## Environment Setup

Copy `api/.env.example` to `api/.env` and configure your PostgreSQL `DATABASE_URL`.

Never commit real database credentials.
