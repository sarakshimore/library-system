"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, Users, Library, Book, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center gap-32">
        {/* Hero Section */}
        <section className="w-full max-w-7xl flex flex-col items-center lg:items-start gap-16">
          {/* Text Column */}
          <div className="flex flex-col items-center lg:items-start gap-10 max-w-3xl mt-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Manage your{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                library
              </span>{" "}
              with ease.
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl text-center lg:text-left">
              A modern dashboard to manage books, authors, users, and borrowing
              flows. Track availability in real time and keep your catalog in
              sync.
            </p>

            <Button
              variant="ghost"
              className="text-base font-medium rounded-lg hover:underline"
              onClick={() => router.push("/dashboard")}
            >
              View Dashboard →
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl flex flex-col items-center gap-20 min-h-screen">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need in one place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl text-center">
              Complete management system with powerful features
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-10 md:grid-cols-3 w-full">

  {/* Card 1 */}
  <div className="shadow-sm rounded-2xl bg-card/40 flex flex-col items-center text-center min-h-[300px] min-w-[260px]">
    <CardHeader className="flex flex-col items-center gap-6 w-full">
      
      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10 mt-10">
        <BookOpen className="h-7 w-7 text-primary "/>
      </div>

      <div className="flex flex-col items-center gap-3 max-w-[220px]">
        <CardTitle className="text-xl font-bold">
          Books & Authors
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Create, update, and manage your entire catalog with powerful search and filtering capabilities.
        </CardDescription>
      </div>

    </CardHeader>
  </div>

  {/* Card 2 */}
  <div className="shadow-sm rounded-2xl bg-card/40 flex flex-col items-center text-center min-h-[300px] min-w-[260px]">
    <CardHeader className="flex flex-col items-center gap-6 w-full">

      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10 mt-10">
        <Users className="h-7 w-7 text-primary" />
      </div>

      <div className="flex flex-col items-center gap-3 max-w-[220px]">
        <CardTitle className="text-xl font-bold">
          Users & Borrowing
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Track borrowing history, manage returns, and monitor user activity with real-time updates.
        </CardDescription>
      </div>

    </CardHeader>
  </div>

  {/* Card 3 */}
  <div className="shadow-sm rounded-2xl bg-card/40 flex flex-col items-center text-center min-h-[300px] min-w-[260px]">
    <CardHeader className="flex flex-col items-center gap-6 w-full">

      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10 mt-10">
        <Lock className="h-7 w-7 text-primary" />
      </div>

      <div className="flex flex-col items-center gap-3 max-w-[220px]">
        <CardTitle className="text-xl font-bold">
          Secure Access
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          JWT-based authentication ensures all operations are protected and authorized properly.
        </CardDescription>
      </div>

    </CardHeader>
  </div>

</div>
        </section>
      </main>
    </>
  );
}
