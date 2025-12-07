"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, User2, Loader2, PlusCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useGetAuthorsQuery, useDeleteAuthorMutation } from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function AuthorsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: authors, isLoading, isError } = useGetAuthorsQuery();
  const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all their books.`)) {
      return;
    }

    try {
      await deleteAuthor(id).unwrap();
      toast.success("Author deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete author");
    }
  };

  // Filter authors based on search query
  const filteredAuthors = authors?.filter((author: any) => {
    const query = searchQuery.toLowerCase();
    return (
      author.name.toLowerCase().includes(query) ||
      author.bio?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 py-20 px-6 flex justify-center">
        <section className="w-full max-w-7xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
                Authors
              </h1>
              <p className="text-muted-foreground">
                Manage all authors in your library.
              </p>
            </div>

            <Button
              className="mt-4 md:mt-0"
              onClick={() => router.push("/authors/add")}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Author
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Search authors by name or bio..."
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
                <User2 className="h-5 w-5 text-primary" />
                Author List {authors && `(${filteredAuthors?.length || 0})`}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">Failed to load authors</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : filteredAuthors && filteredAuthors.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Sr. No.</TableHead>
                      <TableHead className="w-[30%]">Name</TableHead>
                      <TableHead className="w-[40%]">Bio</TableHead>
                      <TableHead className="w-[15%]">Total Books</TableHead>
                      <TableHead className="text-right w-[15%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredAuthors.map((author: any, index: number) => (
                      <TableRow key={author.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{author.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {author.bio ? (
                            author.bio.length > 80 
                              ? `${author.bio.substring(0, 80)}...` 
                              : author.bio
                          ) : (
                            <span className="italic">No bio available</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {author._count?.books || author.books?.length || 0} {(author._count?.books || author.books?.length) === 1 ? 'book' : 'books'}
                          </span>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => router.push(`/authors/edit/${author.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(author.id, author.name)}
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
                  <User2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "No authors found matching your search" : "No authors in the library yet"}
                  </p>
                  <Button onClick={() => router.push("/authors/add")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Author
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
