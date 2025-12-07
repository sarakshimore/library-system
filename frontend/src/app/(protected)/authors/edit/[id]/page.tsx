"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCog, Loader2, ArrowLeft, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useGetAuthorsQuery, useUpdateAuthorMutation } from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: authors, isLoading: authorsLoading } = useGetAuthorsQuery();
  const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  // Find the author from the list and populate form
  useEffect(() => {
    if (authors) {
      const author = authors.find((a: any) => a.id === id);
      if (author) {
        setFormData({
          name: author.name || "",
          bio: author.bio || "",
        });
      }
    }
  }, [authors, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter author name");
      return;
    }

    try {
      await updateAuthor({
        id,
        name: formData.name,
        bio: formData.bio,
      }).unwrap();

      toast.success("Author updated successfully!");
      router.push("/authors");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update author");
    }
  };

  if (authorsLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading author details...</p>
          </div>
        </main>
      </>
    );
  }

  // Check if author exists
  const author = authors?.find((a: any) => a.id === id);
  if (!author) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen w-full flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-destructive mb-4">Author not found</p>
              <Button onClick={() => router.push("/authors")}>
                Back to Authors
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 py-20 px-6 flex justify-center">
        <section className="w-full max-w-3xl">

          {/* Header */}
          <div className="flex items-center justify-between mt-8 mb-10">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UserCog className="h-8 w-8 text-primary" />
              Edit Author
            </h1>
          </div>

          {/* Form */}
          <Card className="border-2 border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Edit Author Details</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Author Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter author name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Author Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Enter author biography"
                    className="min-h-[120px]"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/authors")}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="px-8" disabled={isUpdating}>
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

              </form>
            </CardContent>
          </Card>

        </section>
      </main>
    </>
  );
}