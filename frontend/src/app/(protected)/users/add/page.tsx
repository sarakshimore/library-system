"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAddUserMutation } from "@/features/admin/adminApi";
import { toast } from "sonner";

export default function AddUserPage() {
  const router = useRouter();
  const [addUser, { isLoading }] = useAddUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
      toast.error("Please enter email address");
      return;
    }

    try {
      await addUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
      }).unwrap();

      toast.success("User added successfully!");
      router.push("/users");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add user");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-linear-to-br from-background via-background to-muted/30 py-20 px-6 flex justify-center">
        <section className="w-full max-w-3xl">

          {/* Header */}
          <div className="flex items-center justify-between mt-8 mb-10">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-primary" />
              Add New User
            </h1>
          </div>

          {/* Form */}
          <Card className="border-2 border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
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

                  <Button type="submit" className="px-8" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add User"
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