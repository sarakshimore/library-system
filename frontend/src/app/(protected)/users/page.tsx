"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, PlusCircle, Trash2, Loader2, Users, Plus, Pencil, Book } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useGetUsersQuery, useDeleteUserMutation } from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"? This will also delete their borrow history.`)) {
      return;
    }

    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  // Filter users based on search query
  const filteredUsers = users?.filter((user: any) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query)
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
                Users
              </h1>
              <p className="text-muted-foreground">
                Manage library members who can borrow books.
              </p>
            </div>

            <Button
              className="mt-4 md:mt-0"
              onClick={() => router.push("/users/add")}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add User
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Search users by name, email, or phone..."
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

          {/* Users Table */}
          <Card className="border-2 border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User List {users && `(${filteredUsers?.length || 0})`}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">Failed to load users</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Sr. No.</TableHead>
                      <TableHead className="w-[30%]">Name</TableHead>
                      <TableHead className="w-[30%]">Email</TableHead>
                      <TableHead className="w-[20%]">Phone</TableHead>
                      <TableHead className="text-right w-[20%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.map((user: any, index: number) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.phone || "N/A"}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/users/${user.id}/borrows`)}
                            >
                              <Book className="h-4 w-4 mr-1" />
                              Borrows
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => router.push(`/users/edit/${user.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(user.id, user.name)}
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
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "No users found matching your search" : "No users in the system yet"}
                  </p>
                  <Button onClick={() => router.push("/users/add")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First User
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
