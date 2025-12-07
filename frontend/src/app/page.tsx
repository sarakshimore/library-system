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
import { BookOpen, Users, Library, Book, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 py-20 lg:py-32">
          
          {/* Text Column */}
          <div className="flex flex-col items-center lg:items-start gap-8 lg:gap-10 max-w-3xl lg:flex-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] text-center lg:text-left">
              Manage your{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                library
              </span>{" "}
              with ease.
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl text-center lg:text-left">
              A modern dashboard to manage books, authors, users, and borrowing
              flows. Track availability in real time and keep your catalog in
              sync.
            </p>

            <Button
              size="lg"
              className="text-base font-medium rounded-lg group"
              onClick={() => router.push("/dashboard")}
            >
              View Dashboard 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Illustration Column */}
          <div className="lg:flex-1 w-full max-w-md lg:max-w-lg">
            <div className="relative">
              {/* Stacked Books Illustration */}
              <div className="relative space-y-3">
                
                {/* Book 1 */}
                <div className="h-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-r-lg border-l-4 border-primary transform hover:translate-x-2 transition-transform duration-300 flex items-center px-6">
                  <div className="flex items-center gap-4">
                    <Book className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">The Great Gatsby</p>
                      <p className="text-xs text-muted-foreground">F. Scott Fitzgerald</p>
                    </div>
                  </div>
                </div>

                {/* Book 2 */}
                <div className="h-16 bg-gradient-to-r from-primary/30 to-primary/15 rounded-r-lg border-l-4 border-primary/80 transform hover:translate-x-2 transition-transform duration-300 flex items-center px-6 ml-8">
                  <div className="flex items-center gap-4">
                    <Book className="h-6 w-6 text-primary/80" />
                    <div>
                      <p className="font-semibold text-sm">1984</p>
                      <p className="text-xs text-muted-foreground">George Orwell</p>
                    </div>
                  </div>
                </div>

                {/* Book 3 */}
                <div className="h-16 bg-gradient-to-r from-primary/40 to-primary/20 rounded-r-lg border-l-4 border-primary/60 transform hover:translate-x-2 transition-transform duration-300 flex items-center px-6 ml-16">
                  <div className="flex items-center gap-4">
                    <Book className="h-6 w-6 text-primary/60" />
                    <div>
                      <p className="font-semibold text-sm">To Kill a Mockingbird</p>
                      <p className="text-xs text-muted-foreground">Harper Lee</p>
                    </div>
                  </div>
                </div>

                {/* Book 4 */}
                <div className="h-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-r-lg border-l-4 border-primary/40 transform hover:translate-x-2 transition-transform duration-300 flex items-center px-6 ml-24">
                  <div className="flex items-center gap-4">
                    <Book className="h-6 w-6 text-primary/40" />
                    <div>
                      <p className="font-semibold text-sm">Pride and Prejudice</p>
                      <p className="text-xs text-muted-foreground">Jane Austen</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>


        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl flex flex-col items-center gap-12 sm:gap-16 lg:gap-20 py-18 lg:py-24">
          
          <div className="flex flex-col items-center gap-4 sm:gap-6 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              Everything you need in one place
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl text-center">
              Complete management system with powerful features
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full px-4">

            {/* Card 1 */}
            <Card className="shadow-sm rounded-2xl bg-card/40 border-2 border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-col items-center gap-6 text-center p-6 sm:p-8">
                
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10">
                  <Library className="h-7 w-7 text-primary" />
                </div>

                <div className="flex flex-col items-center gap-3">
                  <CardTitle className="text-xl font-bold">
                    Books & Authors
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Create, update, and manage your entire catalog with powerful search and filtering capabilities.
                  </CardDescription>
                </div>

              </CardHeader>
            </Card>

            {/* Card 2 */}
            <Card className="shadow-sm rounded-2xl bg-card/40 border-2 border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-col items-center gap-6 text-center p-6 sm:p-8">

                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>

                <div className="flex flex-col items-center gap-3">
                  <CardTitle className="text-xl font-bold">
                    Users & Borrowing
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Track borrowing history, manage returns, and monitor user activity with real-time updates.
                  </CardDescription>
                </div>

              </CardHeader>
            </Card>

            {/* Card 3 */}
            <Card className="shadow-sm rounded-2xl bg-card/40 border-2 border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-col items-center gap-6 text-center p-6 sm:p-8">

                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10">
                  <Lock className="h-7 w-7 text-primary" />
                </div>

                <div className="flex flex-col items-center gap-3">
                  <CardTitle className="text-xl font-bold">
                    Secure Access
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    JWT-based authentication ensures all operations are protected and authorized properly.
                  </CardDescription>
                </div>

              </CardHeader>
            </Card>

          </div>
        </section>

      </main>
    </>
  );
}
