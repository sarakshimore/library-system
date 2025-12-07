"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAddAuthorMutation } from "@/features/admin/adminApi";

export default function AddAuthorPage() {
const router = useRouter();
const [name, setName] = useState("");
const [bio, setBio] = useState("");
const [addAuthor, { isLoading }] = useAddAuthorMutation();

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

try {
  await addAuthor({ name, bio }).unwrap(); // send POST request
  router.push("/authors");            // redirect on success
} catch (error) {
  console.error("Failed to add author:", error);
  alert("Failed to add author. Check console for details.");
}

};

return (
<> 
  <Navbar />

  <main className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 py-24 px-6 flex justify-center">
    <section className="w-full max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between mt-8 mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          Add New Author
        </h1>
      </div>

      {/* Form */}
      <Card className="border-2 border-border/60 bg-card/20 shadow-none">
        <CardHeader>
          <CardTitle>Add Author Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Author Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Author Bio</Label>
              <Input
                id="bio"
                placeholder="Enter bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => router.push("/authors")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              <Button type="submit" className="px-8" disabled={isLoading}>
                {isLoading ? (
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
