"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpenCheck, PlusCircle, Undo2, Loader2, Plus } from "lucide-react";
import { useGetBorrowsQuery, useReturnBookMutation } from "@/features/admin/adminApi";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BorrowPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: borrows, isLoading } = useGetBorrowsQuery();
  const [returnBook, { isLoading: isReturning }] = useReturnBookMutation();

  const handleReturn = async (borrowId: string, bookTitle: string) => {
    try {
      await returnBook(borrowId).unwrap();
      toast.success(`"${bookTitle}" returned successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to return book");
    }
  };

  // Filter borrows based on search query
  const filteredBorrows = borrows?.filter((borrow: any) => {
    const query = searchQuery.toLowerCase();
    return (
      borrow.book.title.toLowerCase().includes(query) ||
      borrow.book.author?.name?.toLowerCase().includes(query) ||
      borrow.user.name.toLowerCase().includes(query) ||
      borrow.user.email.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading borrowed books...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-gradient-to-br from-background to-muted/30 py-20 px-6 flex justify-center">
        <section className="w-full max-w-7xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
                Borrow/Return
              </h1>
              <p className="text-muted-foreground">
                Manage all the borrowed books in your library.
              </p>
            </div>

            <Button
              className="mt-4 md:mt-0"
              onClick={() => router.push("/borrows/borrowed")}
            >
              <Plus className="h-5 w-5 mr-2" />
              Borrow a Book
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Search by book title, author, or user..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Table */}
          <Card className="border-2 border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2"> 
                <BookOpenCheck className="h-5 w-5 text-primary" /> 
                Current Borrowed Records {borrows && `(${filteredBorrows?.length || 0})`}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {!filteredBorrows || filteredBorrows.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpenCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {searchQuery ? "No borrowed books found matching your search" : "No books currently borrowed"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Borrowed Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredBorrows.map((borrow: any) => (
                      <TableRow key={borrow.id}>
                        <TableCell className="font-medium">{borrow.book.title}</TableCell>
                        <TableCell>{borrow.book.author?.name || 'N/A'}</TableCell>
                        <TableCell>{borrow.user.name}</TableCell>
                        <TableCell>
                          {format(new Date(borrow.borrowedAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {borrow.dueAt 
                            ? format(new Date(borrow.dueAt), 'MMM dd, yyyy')
                            : 'No due date'}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReturn(borrow.id, borrow.book.title)}
                            disabled={isReturning}
                          >
                            <Undo2 className="h-4 w-4 mr-1" />
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
