# Library Management System

A full-stack library management system built with NestJS, PostgreSQL, Prisma, and Next.js as part of the ONI Full-Stack Intern Assignment.

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Local Development Setup](#-local-development-setup)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Authentication Flow](#-authentication-flow)
- [Testing Protected Routes](#-testing-protected-routes)
- [Project Structure](#-project-structure)
- [Design Decisions](#-design-decisions)
- [Environment Variables](#-environment-variables)

---

## Features

### Core Functionality
- **Books Management**: Complete CRUD operations with author relations and borrowing status filters
- **Authors Management**: Create, update, delete authors with automatic book count tracking
- **Users Management**: Create and manage library members who can borrow books
- **Borrowing System**: 
  - Mark books as borrowed by users
  - Return borrowed books
  - Track borrowing history and due dates
  - View borrowed books per user
- **Authentication**: JWT-based authentication for protected operations

### Bonus Features Implemented
- Dockerized development environment (Backend + PostgreSQL)
- Multi-tenant architecture (each admin has isolated data)
- Advanced filtering for books (by author, availability status)
- Clean, modern UI with shadcn/ui components
- Proper state management with Redux Toolkit
- Real-time form validation
- Responsive design for all screen sizes

---

## Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL 18
- **ORM**: Prisma (with migrations)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: Next.js 15 (TypeScript, App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **HTTP Client**: RTK Query (built on fetch)
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

### DevOps
- **Containerization**: Docker + Docker Compose
- **Database Hosting**: Local PostgreSQL / Supabase (optional)

---

## Quick Start with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Git](https://git-scm.com/) installed

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd library-system
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```
   
   This single command will:
   - Create a PostgreSQL database container (user: `postgres`, password: `postgres`)
   - Build and start the NestJS backend on port 4000
   - Run database migrations automatically
   - Connect all services together

3. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Database: localhost:5432 (postgres/postgres)

5. **Stop the application**
   ```bash
   # Stop and remove containers
   docker-compose down
   
   # Stop and remove containers + volumes (clean slate)
   docker-compose down -v
   ```

---

## Local Development Setup

If you prefer to run without Docker:

### Backend Setup

1. **Prerequisites**
   - Node.js 18+ installed
   - PostgreSQL 15+ installed and running

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Setup database**
   ```sql
   -- Connect to PostgreSQL and create database
   CREATE DATABASE librarydb;
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `backend/.env` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/librarydb?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=4000
   ```

5. **Run migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. **Start the server**
   ```bash
   npm run start:dev
   ```
   
   Backend will run on http://localhost:4000

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Content of `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on http://localhost:3000

---

## Database Schema

### Core Models

```prisma
model Admin {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String   // hashed with bcrypt
  createdAt DateTime @default(now())
  
  books     Book[]
  authors   Author[]
  users     User[]
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  phone     String?
  adminId   String
  admin     Admin    @relation(fields: [adminId], references: [id])
  borrows   Borrow[]
}

model Author {
  id        String   @id @default(uuid())
  name      String
  bio       String?
  adminId   String
  admin     Admin    @relation(fields: [adminId], references: [id])
  books     Book[]
}

model Book {
  id          String    @id @default(uuid())
  title       String
  description String?
  isbn        String?   @unique
  publishedAt DateTime?
  isBorrowed  Boolean   @default(false)
  authorId    String
  author      Author    @relation(fields: [authorId], references: [id])
  adminId     String
  admin       Admin     @relation(fields: [adminId], references: [id])
  borrows     Borrow[]
}

model Borrow {
  id         String    @id @default(uuid())
  borrowedAt DateTime  @default(now())
  dueAt      DateTime?
  returnedAt DateTime?
  userId     String
  user       User      @relation(fields: [userId], references: [id])
  bookId     String
  book       Book      @relation(fields: [bookId], references: [id])
}
```

### Key Relationships
- Admin → owns multiple Books, Authors, and Users (multi-tenant)
- Book → belongs to one Author
- User → can have multiple Borrows
- Book → can have multiple Borrow records (history)

---

## API Endpoints

### Authentication (Public)
```
POST   /auth/register    - Register new admin
POST   /auth/login       - Login admin
POST   /auth/logout      - Logout admin
```

### Books (Protected - JWT Required)
```
GET    /books            - List all books (filtered by admin)
GET    /books/:id        - Get single book
POST   /books            - Create new book
PATCH  /books/:id        - Update book
DELETE /books/:id        - Delete book
```

### Authors (Protected - JWT Required)
```
GET    /authors          - List all authors (filtered by admin)
POST   /authors          - Create new author
PATCH  /authors/:id      - Update author
DELETE /authors/:id      - Delete author
```

### Users (Protected - JWT Required)
```
GET    /users            - List all users (filtered by admin)
POST   /users            - Create new user
PATCH  /users/:id        - Update user
DELETE /users/:id        - Delete user
```

### Borrowing (Protected - JWT Required)
```
GET   /borrows                       - List all borrowed books
POST  /borrows/borrow                - Borrow a book
POST  /borrows/borrow/return/:id     - Return a borrowed book
```

---

## Authentication Flow

### 1. Register an Admin

**Request:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securePassword123"
  }'
```

**Response:** Same as registration

### 3. Use Token for Protected Routes

**Request:**
```bash
curl -X GET http://localhost:4000/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Testing Protected Routes

### Using cURL

```bash
# Save your token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# List books
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/books

# Create a book
curl -X POST http://localhost:4000/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "authorId": "author-uuid-here",
    "description": "A handbook of agile software craftsmanship",
    "isbn": "9780132350884"
  }'

# Create an author first
curl -X POST http://localhost:4000/authors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Robert C. Martin",
    "bio": "Software engineer and author"
  }'
```

### Using the Frontend

1. Navigate to http://localhost:3000
2. Click "Register" and create an admin account
3. You'll be automatically logged in
4. Start adding books, authors, and users!

---

## Project Structure

```
library-system/
│
├── backend/
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── dto/
│   │   ├── books/                # Books CRUD
│   │   │   ├── books.controller.ts
│   │   │   ├── books.service.ts
│   │   │   └── dto/
│   │   ├── authors/              # Authors CRUD
│   │   │   ├── authors.controller.ts
│   │   │   ├── authors.service.ts
│   │   │   └── dto/
│   │   ├── users/                # Users CRUD
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   ├── borrow/               # Borrowing system
│   │   │   ├── borrow.controller.ts
│   │   │   └── borrow.service.ts
│   │   ├── prisma/               # Prisma service
│   │   │   └── prisma.service.ts
│   │   └── main.ts               # Application entry
│   │
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Migration history
│   │
│   ├── Dockerfile                # Docker configuration
│   ├── .dockerignore
│   ├── .env.example              # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js pages (App Router)
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── books/
│   │   │   ├── authors/
│   │   │   └── users/
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── features/             # Redux slices & API
│   │   │   ├── auth/
│   │   │   │   ├── authApi.ts
│   │   │   │   └── authSlice.ts
│   │   │   └── admin/
│   │   │       └── adminApi.ts
│   │   └── lib/                  # Utils & config
│   │       └── store.ts          # Redux store
│   │
│   ├── .env.example              # Environment template
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── docker-compose.yml            # Docker orchestration
├── .gitignore
└── README.md
```

---

## Design Decisions

### 1. Multi-Tenant Architecture
**Decision**: Each admin has isolated data (books, authors, users)

**Implementation**:
- Added `adminId` foreign key to Book, Author, and User models
- All queries filter by `adminId` extracted from JWT
- Cascade delete ensures data cleanup

**Rationale**: Allows multiple libraries/admins to use the same system independently

### 2. Separate Admin and User Models
**Decision**: Admin (manages system) vs User (library member)

**Rationale**:
- Clear separation of concerns
- Users don't need passwords (managed by admin)
- Admins have full CRUD capabilities
- Users only borrow/return books

### 3. JWT Authentication
**Decision**: Stateless JWT tokens stored in localStorage + Redux

**Rationale**:
- Scalable (no server-side sessions)
- Works well with REST APIs
- Easy to implement in frontend
- Tokens auto-expire after 7 days

### 4. Redux Toolkit + RTK Query
**Decision**: Centralized state management with automatic caching

**Rationale**:
- RTK Query handles caching, loading states, and refetching
- Automatic cache invalidation on mutations
- Type-safe API calls
- Reduces boilerplate compared to manual fetch

### 5. Prisma ORM
**Decision**: Type-safe database access with migrations

**Rationale**:
- Auto-generated TypeScript types
- Database-agnostic (easy to switch databases)
- Built-in migration system
- Excellent developer experience

### 6. Docker Multi-Stage Builds
**Decision**: Separate build and production stages

**Rationale**:
- Smaller production image (~200MB vs ~500MB)
- Faster deployments
- Security (no dev dependencies in production)

---

## Environment Variables

### Backend (.env)

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/librarydb?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=4000
```

### Frontend (.env.local)

```env
# API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Docker Environment (docker-compose.yml)

```yaml
environment:
  DATABASE_URL: postgresql://postgres:postgres@db:5432/librarydb?schema=public
  JWT_SECRET: your-super-secret-jwt-key
  JWT_EXPIRES_IN: 7d
  PORT: 4000
```

---

## Testing

### Manual Testing Checklist

- [ ] Register new admin
- [ ] Login with admin credentials
- [ ] Create an author
- [ ] Create a book with the author
- [ ] Create a library user
- [ ] Borrow a book for the user
- [ ] Return the borrowed book
- [ ] Filter books by author
- [ ] Filter books by availability
- [ ] Update book details
- [ ] Delete a book
- [ ] Logout

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database connection
docker-compose logs db

# Restart services
docker-compose restart
```

### Issue: "Prisma Client not generated"

**Solution**:
```bash
cd backend
npx prisma generate
```

### Issue: "Port 4000 already in use"

**Solution**:
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>
```

### Issue: "JWT token expired"

**Solution**: Login again to get a new token

---

## Author

**Sarakshi More**
- [GitHub](https://github.com/sarakshimore)
- [LinkedIn](https://www.linkedin.com/in/sarakshi-m-158212211/)

---

## Acknowledgments

- Assignment provided by **ONI** as part of the Full-Stack Intern hiring process
- Built with [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), [Next.js](https://nextjs.org/), and [shadcn/ui](https://ui.shadcn.com/)

---

## License

This project is for educational and assessment purposes only.
