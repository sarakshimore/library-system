"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpenCheck, Loader2 } from "lucide-react";
import { 
  useGetUsersQuery, 
  useGetBooksQuery, 
  useBorrowBookMutation 
} from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function BorrowAddPage() {
  const router = useRouter();

  // Fetch users and available books
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: books, isLoading: booksLoading } = useGetBooksQuery();
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();

  const [form, setForm] = useState({
    userId: "",
    bookId: "",
    dueAt: "",
  });

  // Filter only available (not borrowed) books
  const availableBooks = books?.filter((book: any) => !book.isBorrowed) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.userId || !form.bookId) {
      toast.error("Please select both user and book");
      return;
    }

    try {
      const payload: any = {
        userId: form.userId,
        bookId: form.bookId,
      };

      // Only include dueAt if provided
      if (form.dueAt) {
        payload.dueAt = new Date(form.dueAt).toISOString();
      }

      await borrowBook(payload).unwrap();
      toast.success("Book borrowed successfully!");
      router.push("/borrows");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to borrow book");
    }
  };

  if (usersLoading || booksLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading form data...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-gradient-to-br from-background to-muted/30 py-20 px-6 flex justify-center">
        <section className="w-full max-w-3xl">

          {/* Header */}
          <div className="flex items-center justify-between mt-8 mb-10">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpenCheck className="h-8 w-8 text-primary" />
              Borrow a Book
            </h1>
          </div>

          <Card className="border-2 border-border/60 bg-card/20 shadow-none">
            <CardHeader>
              <CardTitle>Borrow Details</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Select User */}
                <div className="space-y-2">
                  <Label htmlFor="userId">User *</Label>
                  <select
                    id="userId"
                    className="w-full border border-input rounded-md p-2 bg-background"
                    required
                    value={form.userId}
                    onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  >
                    <option value="">Select a user</option>
                    {users?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {!users || users.length === 0 && (
                    <p className="text-sm text-muted-foreground">No users available. Create a user first.</p>
                  )}
                </div>

                {/* Select Book */}
                <div className="space-y-2">
                  <Label htmlFor="bookId">Book *</Label>
                  <select
                    id="bookId"
                    className="w-full border border-input rounded-md p-2 bg-background"
                    required
                    value={form.bookId}
                    onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                  >
                    <option value="">Select a book</option>
                    {availableBooks.map((book: any) => (
                      <option key={book.id} value={book.id}>
                        {book.title} {book.author?.name ? `- ${book.author.name}` : ''}
                      </option>
                    ))}
                  </select>
                  {availableBooks.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No available books. All books are currently borrowed.
                    </p>
                  )}
                </div>

                {/* Due Date (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="dueAt">Due Date (Optional)</Label>
                  <Input
                    id="dueAt"
                    type="date"
                    value={form.dueAt}
                    onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty if there's no specific due date
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-8">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => router.push("/borrows")}
                    disabled={isBorrowing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isBorrowing || availableBooks.length === 0}
                  >
                    {isBorrowing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Borrowing...
                      </>
                    ) : (
                      "Borrow Book"
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

        </section>
      </main>
    </>
  );
}
