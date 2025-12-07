"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import Navbar from "@/components/Navbar";

import { Pencil, Trash2, BookOpen, Plus, Loader2, PlusCircle } from "lucide-react";
import { useGetBooksQuery, useDeleteBookMutation } from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function BooksPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: books, isLoading, error } = useGetBooksQuery();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteBook(id).unwrap();
      toast.success("Book deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete book");
    }
  };

  // Filter books based on search query
  const filteredBooks = books?.filter((book: any) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-linear-to-br from-background via-background to-muted/30 px-6 py-20 flex justify-center">
        <section className="w-full max-w-7xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
                Books
              </h1>
              <p className="text-muted-foreground">
                Manage all books in your library.
              </p>
            </div>

            <Button
              className="mt-4 md:mt-0"
              onClick={() => router.push("/books/add")}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Book
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Search books by title or author..."
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

          {/* Books Table */}
          <Card className="border-2 border-border/60 bg-card/20 shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Book List {books && `(${filteredBooks?.length || 0})`}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive">Failed to load books</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredBooks && filteredBooks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="text-muted-foreground">
                      <TableHead className="w-[35%]">Title</TableHead>
                      <TableHead className="w-[25%]">Author</TableHead>
                      <TableHead className="w-[20%]">ISBN</TableHead>
                      <TableHead className="w-[10%]">Status</TableHead>
                      <TableHead className="text-right w-[10%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredBooks.map((book: any) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author?.name || "Unknown"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {book.isbn || "N/A"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              book.isBorrowed
                                ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            }`}
                          >
                            {book.isBorrowed ? "Borrowed" : "Available"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => router.push(`/books/edit/${book.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(book.id, book.title)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "No books found matching your search" : "No books in the library yet"}
                  </p>
                  <Button onClick={() => router.push("/books/add")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Book
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </section>
      </main>
    </>
  );
}