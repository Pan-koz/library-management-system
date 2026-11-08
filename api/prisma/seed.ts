import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding...");

  const genreNames = [
    "Fiction",
    "Technology",
    "History",
    "Science",
  ];

  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const [fiction, technology, history, science] = genres;

  const books = [
    {
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      isbn: "9780385474542",
      publishedYear: 1958,
      description: "A novel about Igbo society and colonialism.",
      genreId: fiction.id,
    },
    {
      title: "The River Between",
      author: "Ngugi wa Thiong'o",
      isbn: "9780435905484",
      publishedYear: 1965,
      description: "A novel exploring tradition and cultural change.",
      genreId: fiction.id,
    },
    {
      title: "Animal Farm",
      author: "George Orwell",
      isbn: "9780451526342",
      publishedYear: 1945,
      description: "A political allegory about power and corruption.",
      genreId: fiction.id,
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      publishedYear: 1925,
      description: "A novel about ambition and the American Dream.",
      genreId: fiction.id,
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      publishedYear: 2008,
      description: "A guide to writing maintainable software.",
      genreId: technology.id,
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt and David Thomas",
      isbn: "9780135957059",
      publishedYear: 2019,
      description: "Practical advice for professional software developers.",
      genreId: technology.id,
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen and others",
      isbn: "9780262046305",
      publishedYear: 2022,
      description: "A comprehensive introduction to computer algorithms.",
      genreId: technology.id,
    },
    {
      title: "The Art of Computer Programming",
      author: "Donald Knuth",
      isbn: "9780201896831",
      publishedYear: 1997,
      description: "A detailed study of computer programming techniques.",
      genreId: technology.id,
    },
    {
      title: "A People's History of the United States",
      author: "Howard Zinn",
      isbn: "9780062397348",
      publishedYear: 1980,
      description: "History from the perspective of ordinary people.",
      genreId: history.id,
    },
    {
      title: "The Making of the Modern World",
      author: "Robert B. Marks",
      isbn: "9781442212394",
      publishedYear: 2007,
      description: "An overview of global history and modern development.",
      genreId: history.id,
    },
    {
      title: "The History of Kenya",
      author: "W. R. Ochieng",
      isbn: "9780435948109",
      publishedYear: 1985,
      description: "A study of Kenya's historical development.",
      genreId: history.id,
    },
    {
      title: "Guns, Germs, and Steel",
      author: "Jared Diamond",
      isbn: "9780393354324",
      publishedYear: 1997,
      description: "An exploration of human societies and their development.",
      genreId: history.id,
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "9780553380163",
      publishedYear: 1988,
      description: "An introduction to cosmology and the universe.",
      genreId: science.id,
    },
    {
      title: "The Selfish Gene",
      author: "Richard Dawkins",
      isbn: "9780198788607",
      publishedYear: 1976,
      description: "An explanation of evolution from the gene's perspective.",
      genreId: science.id,
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      isbn: "9780345539434",
      publishedYear: 1980,
      description: "An exploration of astronomy and scientific discovery.",
      genreId: science.id,
    },
    {
      title: "The Origin of Species",
      author: "Charles Darwin",
      isbn: "9781509827695",
      publishedYear: 1859,
      description: "A foundational work on evolution by natural selection.",
      genreId: science.id,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
  }

  const users = [
    {
      name: "John Kamau",
      email: "john@example.com",
      role: "PATRON" as const,
    },
    {
      name: "Mary Wanjiku",
      email: "mary@example.com",
      role: "LIBRARIAN" as const,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { role: user.role },
      create: user,
    });
  }

  console.log("Database seeding completed successfully!");
  console.log("4 genres, 16 books, and 2 users processed.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
