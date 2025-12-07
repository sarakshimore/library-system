"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { useGetUserBorrowsQuery } from "@/features/admin/adminApi";
import { format } from "date-fns";

export default function UserBorrowsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: borrowData, isLoading } = useGetUserBorrowsQuery(id);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading user borrows...</p>
          </div>
        </main>
      </>
    );
  }

  const borrows = borrowData || [];
  const userName = borrows[0]?.user?.name || "User";

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-gradient-to-br from-background to-muted/30 py-20 px-6 flex justify-center">
        <section className="w-full max-w-7xl">

          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 flex items-center gap-2"
            onClick={() => router.push("/users")}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Users
          </Button>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              {userName}'s Borrowed Books
            </h1>
          </div>

          {/* Table */}
          <Card className="border-2 border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Active Borrows</CardTitle>
            </CardHeader>

            <CardContent>
              {borrows.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>This user has no active borrowed books</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Borrowed Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {borrows.map((borrow: any) => {
                      const isOverdue = borrow.dueAt && new Date(borrow.dueAt) < new Date();
                      
                      return (
                        <TableRow key={borrow.id}>
                          <TableCell className="font-medium">
                            {borrow.book.title}
                          </TableCell>
                          <TableCell>
                            {borrow.book.author?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {format(new Date(borrow.borrowedAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {borrow.dueAt 
                              ? format(new Date(borrow.dueAt), 'MMM dd, yyyy')
                              : 'No due date'}
                          </TableCell>
                          <TableCell>
                            {isOverdue ? (
                              <span className="text-destructive font-medium">Overdue</span>
                            ) : (
                              <span className="text-green-600 font-medium">Active</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        </section>
      </main>
    </>
  );
}
