"use client";

import { Book, BookOpenCheck, Home, LayoutDashboard, Library, LibraryBig, LogIn, LogOut, Menu, User, User2, UserPlus, Users, Users2 } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  const [logoutUser, { isLoading: logoutLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Pass undefined or empty object as RTK Query mutations require an argument
      await logoutUser().unwrap();
      toast.success("Logged out");
    } catch (err: any) {
      // If backend fails, still logout locally
      console.error("Logout API error:", err);
      toast.success("Logged out");
    } finally {
      // Always clear local state and redirect
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  return (
    <header className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <LibraryBig size={28} className="text-primary" />
          <Link href="/" className="hidden md:block">
            <h1 className="font-extrabold text-2xl">Library System</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm">Dashboard</Link>
            <Link href="/books" className="text-sm">Books</Link>
            <Link href="/authors" className="text-sm">Authors</Link>
            <Link href="/users" className="text-sm">Users</Link>
            <Link href="/borrows" className="text-sm">Borrow/Return</Link>
          </nav>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9">
                  <AvatarImage src={user.photoUrl || user.avatar || "https://github.com/shadcn.png"} alt={user.name} />
                  <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Logged in as <div className="font-semibold">{user.name}</div></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout}>{logoutLoading ? "Logging out..." : "Logout"}</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/login")}>Login</Button>
              <Button onClick={() => router.push("/register")}>Register</Button>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <MobileNavbar user={user} onLogout={handleLogout} logoutLoading={logoutLoading} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const MobileNavbar: React.FC<{ user?: any; onLogout: () => void; logoutLoading: boolean }> = ({ 
  user, 
  onLogout, 
  logoutLoading 
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false); // Close sheet after navigation
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost" 
          className="rounded-full hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
        </SheetHeader>
        
        <nav className="mt-6 flex flex-col gap-3">
          {/* Navigation Links */}
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Home</span>
          </button>

          <button
            onClick={() => handleNavigation("/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation("/books")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <Book className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Books</span>
          </button>

          <button
            onClick={() => handleNavigation("/authors")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Authors</span>
          </button>

          <button
            onClick={() => handleNavigation("/users")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <Users2 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Users</span>
          </button>

          <button
            onClick={() => handleNavigation("/borrows")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <BookOpenCheck className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Borrow/Return</span>
          </button>

          {/* Divider */}
          <div className="my-2 border-t"></div>

          {/* User Section */}
          {user ? (
            <>
              {/* User Info Card */}
              <div className="px-4 py-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="destructive" 
                className="w-30 mt-2 mx-20 justify-center gap-3" 
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }} 
                disabled={logoutLoading}
              >
                <LogOut className="h-5 w-5" />
                {logoutLoading ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="w-30 mx-20 justify-center gap-3" 
                onClick={() => handleNavigation("/login")}
              >
                <LogIn className="h-5 w-5" />
                Login
              </Button>
              
              <Button 
                variant="outline" 
                className="w-30 mx-20 justify-center gap-3" 
                onClick={() => handleNavigation("/register")}
              >
                <UserPlus className="h-5 w-5" />
                Register
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
