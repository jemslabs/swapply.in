import { useEffect, useRef } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/stores/useAuth";
import clsx from "clsx";

import {
  Bell,
  User,
  Plus,
  LogOut,
  Compass,
  LayoutList,
  RefreshCw,
} from "lucide-react";

import Logo from "./Logo";
import type { loginData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "./ui/separator";

function Navbar() {
  const { user, login } = useAuth();
  const { isSignedIn, user: clerkUser, isLoaded } = useUser();
  const hasSynced = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn || !clerkUser || !isLoaded || hasSynced.current) return;
    hasSynced.current = true;

    const userData: loginData = {
      name: clerkUser.fullName || "",
      image: clerkUser.imageUrl || "",
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      clerkId: clerkUser.id || "",
    };

    login(userData);
  }, [isSignedIn, clerkUser, isLoaded, login]);

  const navClasses = clsx(
    "fixed top-2 left-2 right-2 z-50",
    "bg-[#2a202d]/70 backdrop-blur-md border",
    "rounded-2xl shadow-xl px-6 py-2",
    "flex justify-between items-center"
  );

  return (
    <nav className={navClasses}>
      <div className="flex items-center gap-3">
        <Logo />
        <Link
          to="/browse"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:text-white hover:bg-[#c084fc]/10 transition-all leading-none"
        >
          <Compass size={16} className="text-white/70" />
          <span>Browse</span>
        </Link>
        <Link
          to="/swap/requests"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:text-white hover:bg-[#c084fc]/10 transition-all leading-none"
        >
          <RefreshCw size={16} className="text-white/70" />
          <span>Requests</span>
        </Link>
      </div>


      <div className="flex items-center gap-3">
        {clerkUser && user ? (
          <>
            <Button
              onClick={() => navigate("/new")}
              className="flex items-center justify-center gap-2 px-4 py-2"
            >
              <Plus className="w-5 h-5 shrink-0" />
              <span className="leading-none">New</span>
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="hover:bg-[#c084fc]/10 text-white"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 border border-white/20 cursor-pointer hover:ring-2 ring-[#c084fc]/50">
                  <AvatarImage src={clerkUser.imageUrl} alt="User" />
                  <AvatarFallback>
                    {clerkUser.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#2a202d]/70 text-white border mt-2 w-56 rounded-xl shadow-xl space-y-1">
                <DropdownMenuItem
                  onClick={() => navigate(`/profile/${user?.id}`)}
                  className="px-4 py-3 rounded-lg transition-all data-[highlighted]:bg-[#c084fc]/10 cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/my-listings")}
                  className="px-4 py-3 rounded-lg transition-all data-[highlighted]:bg-[#c084fc]/10 cursor-pointer"
                >
                  <LayoutList className="w-4 h-4 mr-2" />
                  My Listings
                </DropdownMenuItem>

                <Separator />

                <DropdownMenuItem className="px-4 py-3 rounded-lg transition-all data-[highlighted]:bg-[#c084fc]/10 cursor-pointer">
                  <SignOutButton>
                    <span className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 mr-2 text-red-400" />
                      <span className="text-red-400">Logout</span>
                    </span>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <SignInButton mode="modal">
            <Button variant="default">Login</Button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
