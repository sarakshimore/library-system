"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Library, History, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { 
  useGetBooksQuery, 
  useGetUsersQuery, 
  useGetAuthorsQuery, 
  useGetBorrowsQuery 
} from "@/features/admin/adminApi";

export default function DashboardPage() {
  // Fetch all data
  const { data: books, isLoading: booksLoading } = useGetBooksQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: authors, isLoading: authorsLoading } = useGetAuthorsQuery();
  const { data: borrows, isLoading: borrowsLoading } = useGetBorrowsQuery();

  // Calculate stats
  const totalBooks = books?.length || 0;
  const totalUsers = users?.length || 0;
  const totalAuthors = authors?.length || 0;
  const activeBorrows = borrows?.length || 0;

  const isLoading = booksLoading || usersLoading || authorsLoading || borrowsLoading;

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-linear-to-br from-background via-background to-muted/30 px-6 py-20 flex justify-center">
        <section className="w-full max-w-7xl">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Overview of your library system activity and statistics.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
            
            <Card className="border-2 border-border/60 shadow-none bg-card/30 hover:bg-card/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                {booksLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-4xl font-bold">{totalBooks}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border/60 shadow-none bg-card/30 hover:bg-card/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <Users className="h-6 w-6 text-primary" />
                  Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-4xl font-bold">{totalUsers}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border/60 shadow-none bg-card/30 hover:bg-card/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <Library className="h-6 w-6 text-primary" />
                  Authors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {authorsLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-4xl font-bold">{totalAuthors}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border/60 shadow-none bg-card/30 hover:bg-card/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <History className="h-6 w-6 text-primary" />
                  Active Borrows
                </CardTitle>
              </CardHeader>
              <CardContent>
                {borrowsLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-4xl font-bold">{activeBorrows}</p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Additional Stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            
            <Card className="border-2 border-border/60 shadow-none bg-card/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-muted-foreground">
                  Available Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                {booksLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-3xl font-bold text-green-600">
                    {books?.filter((book: any) => !book.isBorrowed).length || 0}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border/60 shadow-none bg-card/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-muted-foreground">
                  Borrowed Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                {booksLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-3xl font-bold text-red-600">
                    {books?.filter((book: any) => book.isBorrowed).length || 0}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border/60 shadow-none bg-card/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-muted-foreground">
                  Total Book Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                {authorsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-3xl font-bold">
                    {authors?.reduce((sum: number, author: any) => 
                      sum + (author._count?.books || author.books?.length || 0), 0
                    ) || 0}
                  </p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Quick Summary */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Quick Summary</h2>

            <Card className="border-2 border-border/60 bg-card/20">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Library Capacity</span>
                      <span className="font-semibold">{totalBooks} books</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Registered Members</span>
                      <span className="font-semibold">{totalUsers} users</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Book Collection</span>
                      <span className="font-semibold">{totalAuthors} authors</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Currently Borrowed</span>
                      <span className="font-semibold text-primary">{activeBorrows} books</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Availability Rate</span>
                      <span className="font-semibold text-green-600">
                        {totalBooks > 0 
                          ? Math.round((books?.filter((b: any) => !b.isBorrowed).length / totalBooks) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

        </section>
      </main>
    </>
  );
}
