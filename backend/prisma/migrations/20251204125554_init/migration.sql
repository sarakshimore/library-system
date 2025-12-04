-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isbn" TEXT,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Borrow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "Borrow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE INDEX "Borrow_userId_idx" ON "Borrow"("userId");

-- CreateIndex
CREATE INDEX "Borrow_bookId_idx" ON "Borrow"("bookId");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
