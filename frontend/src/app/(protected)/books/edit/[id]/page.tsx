"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { ArrowLeft, Save, Book, Loader2 } from "lucide-react";
import { useGetBookByIdQuery, useUpdateBookMutation, useGetAuthorsQuery } from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap the Promise

  const { data: book, isLoading: isLoadingBook, error } = useGetBookByIdQuery(id);
  const { data: authorsData, isLoading: authorsLoading } = useGetAuthorsQuery();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const [formData, setFormData] = useState({
    title: "",
    authorId: "",
    description: "",
    isbn: "",
    publishedAt: "",
  });

  // Populate form when book data is loaded
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        authorId: book.authorId || "",
        description: book.description || "",
        isbn: book.isbn || "",
        publishedAt: book.publishedAt ? new Date(book.publishedAt).toISOString().split('T')[0] : "",
      });
    }
  }, [book]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleAuthorChange = (value: string) => {
    setFormData({
      ...formData,
      authorId: value,
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a book title");
      return;
    }
    if (!formData.authorId) {
      toast.error("Please select an author");
      return;
    }

    try {
      const payload: any = {
        id,
        title: formData.title,
        authorId: formData.authorId,
      };

      if (formData.description) payload.description = formData.description;
      if (formData.isbn) payload.isbn = formData.isbn;
      if (formData.publishedAt) payload.publishedAt = new Date(formData.publishedAt).toISOString();

      await updateBook(payload).unwrap();
      toast.success("Book updated successfully!");
      router.push("/books");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update book");
    }
  };

  if (isLoadingBook) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 px-6 py-16 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading book details...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 px-6 py-16 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-destructive mb-4">Failed to load book</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => router.push("/books")}>
                  Back to Books
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 px-6 py-16 flex justify-center">
        <section className="w-full max-w-3xl py-10">

          <Card className="border-2 border-border/60 bg-card/20 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Book className="h-6 w-6 text-primary" />
                Edit Book
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 mt-4">

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  placeholder="Enter book title"
                  className="h-12"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              {/* Author Dropdown */}
              <div className="space-y-2">
                <Label>Author</Label>
                {authorsLoading ? (
                  <div className="h-12 bg-muted rounded-md animate-pulse" />
                ) : (
                  <Select value={formData.authorId} onValueChange={handleAuthorChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authorsData?.map((author: any) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-muted-foreground">
                  Current: <span className="font-medium">{book?.author?.name}</span>
                </p>
              </div>

              {/* ISBN */}
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN (Optional)</Label>
                <Input
                  id="isbn"
                  placeholder="Enter ISBN"
                  className="h-12"
                  value={formData.isbn}
                  onChange={handleInputChange}
                />
              </div>

              {/* Published Date */}
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Published Date (Optional)</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  className="h-12"
                  value={formData.publishedAt}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Short description of the book"
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Cancel & Save Button */}
              <div className="flex justify-end gap-3 mt-8">
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => router.push("/books")}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                <Button
                onClick={handleSubmit}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}