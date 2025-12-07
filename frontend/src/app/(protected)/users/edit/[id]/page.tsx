"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useGetUsersQuery, useUpdateUserMutation } from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Find the user from the list and populate form
  useEffect(() => {
    if (users) {
      const user = users.find((u: any) => u.id === id);
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
    }
  }, [users, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter user name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter user email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await updateUser({
        id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined, // Optional field
      }).unwrap();

      toast.success("User updated successfully!");
      router.push("/users");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user");
    }
  };

  if (usersLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading user details...</p>
          </div>
        </main>
      </>
    );
  }

  // Check if user exists
  const user = users?.find((u: any) => u.id === id);
  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen w-full flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-destructive mb-4">User not found</p>
              <Button onClick={() => router.push("/users")}>
                Back to Users
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
              Edit User
            </h1>
          </div>

          {/* Form */}
          <Card className="border-2 border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Edit User Details</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter user name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter user email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/users")}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="px-8" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
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
