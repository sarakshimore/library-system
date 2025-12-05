"use client";

import { Menu, LibraryBig } from "lucide-react";
import { useEffect } from "react";
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
// import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/features/auth/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import Link from "next/link";

const Navbar = () => {
  //const [name, setName] = useState("");
  //const { data, isLoading, refetch } = useLoadUserQuery();
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutMutation();
  const router = useRouter();

  // const logoutHandler = async () => {
  //   await logoutUser();
  // };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      router.push("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 z-10 bg-white border-b border-gray-200 shadow-sm">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto md:flex justify-around gap-120 h-full">
        <div className="flex items-center gap-2">
          <LibraryBig size={"30"} />
          <Link href="/">
            <h1 className="hidden md:block font-extrabold text-2xl">
              Library System 
            </h1> 
          </Link>
        </div>
        {/* User icons and dark mode icon  */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {user?.role === "instructor" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <b>Welcome, instructor {user.name}</b>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user?.role === "student" && (
                    <>
                      <DropdownMenuItem>
                        <b>Welcome, student {user.name}</b>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="my-learning">My learning</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem>
                    {" "}
                    <Link href="profile">Edit Profile</Link>{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Link to="/admin/dashboard">Dashboard</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button className="w-20" variant="outline" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button className="w-20" onClick={() => router.push("/login")}>Signup</Button>
            </div>
          )}
          {/* <DarkMode /> */}
        </div>
      </div>
      {/* Mobile device  */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-learning</h1>
        <MobileNavbar user={user}/>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({user}) => {
  const router = useRouter();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle> <Link to="/">E-Learning</Link></SheetTitle>
          {/* <DarkMode /> */}
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <Link to="/my-learning">My Learning</Link>
          <Link to="/profile">Edit Profile</Link>
          <p>Log out</p>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={()=> router.push("/admin/dashboard")}>Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};