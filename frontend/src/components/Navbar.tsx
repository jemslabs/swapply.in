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

    async function handleSyncUser(data: loginData) {
      await login(data);
      navigate("/browse");
    }

    handleSyncUser(userData);
  }, [isSignedIn, clerkUser, isLoaded, user]);

  const navClasses = clsx(
    "fixed top-4 left-3 right-3 z-50",
    "bg-[#2a202d]/70 backdrop-blur-md border border-[#3a2f43]",
    "rounded-2xl shadow-xl px-6 py-2",
    "flex justify-between items-center"
  );

  return (
    <nav className={navClasses}>
      <div className="flex items-center gap-3">
        <Logo />
        <Link
          to="/browse"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-[#c084fc]/10 transition-all flex items-center gap-2">
          <Compass size={16} />
          Browse
        </Link>
      </div>
      <div className="flex items-center gap-3">


        {clerkUser ? (
          <>
            <Button
              onClick={() => navigate("/new")}>
              <Plus className="w-5 h-5" />
              New
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="relative hover:bg-[#c084fc]/10 text-white">
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
              <DropdownMenuContent className="bg-[#2a202d] text-white border border-[#3a2f43] mt-2 w-56 rounded-xl shadow-xl space-y-1">
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="px-4 py-3 cursor-pointer rounded-lg transition-all data-[highlighted]:bg-[#c084fc]/10">
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>


                <DropdownMenuItem
                  onClick={() => navigate("/my-listings")}
                  className="px-4 py-3 cursor-pointer rounded-lg transition-all data-[highlighted]:bg-[#c084fc]/10">
                  <LayoutList className="w-4 h-4 mr-2" />
                  My Listings
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/requests")}
                  className="px-4 py-3 cursor-pointer rounded-lg transition-all data-[highlighted]:bg-[#c084fc]/10">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Swap Requests
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem
                  className="px-4 py-3 cursor-pointer rounded-lg transition-all data-[highlighted]:bg-[#c084fc]/10">
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
            <Button
              variant="default">
              Login
            </Button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
