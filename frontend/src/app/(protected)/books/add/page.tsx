"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { ArrowLeft, PlusCircle, BookOpen, Loader2 } from "lucide-react";
import { useAddBookMutation } from "@/features/admin/adminApi";
import { useGetAuthorsQuery } from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function AddBookPage() {
  const router = useRouter();
  const [addBook, { isLoading }] = useAddBookMutation();
  const { data: authorsData, isLoading: authorsLoading } = useGetAuthorsQuery();

  const [formData, setFormData] = useState({
    title: "",
    authorId: "",
    description: "",
    isbn: "",
    publishedAt: "",
  });

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
        title: formData.title,
        authorId: formData.authorId,
      };

      if (formData.description) payload.description = formData.description;
      if (formData.isbn) payload.isbn = formData.isbn;
      if (formData.publishedAt) payload.publishedAt = new Date(formData.publishedAt).toISOString();

      await addBook(payload).unwrap();
      toast.success("Book added successfully!");
      router.push("/books");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add book");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/30 px-6 py-20 flex justify-center">
        <section className="w-full max-w-3xl">

          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-4 flex items-center gap-2"
            onClick={() => router.push("/books")}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Books
          </Button>

          {/* Card */}
          <Card className="border-2 border-border/60 bg-card/20 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Add New Book
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
                  Don't see your author? <span className="text-primary cursor-pointer hover:underline" onClick={() => router.push("/authors/add")}>Add a new author</span>
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

              {/* Submit Button */}
              <Button
                size="lg"
                className="w-full h-12 font-semibold flex items-center justify-center"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Adding Book...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Book
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}