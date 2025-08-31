import { useEffect, useRef, useState } from "react";
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
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    "rounded-2xl shadow-xl px-4 sm:px-6 py-2",
    "flex justify-between items-center"
  );

  // Desktop Left Links
  const leftLinks = (
    <>
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
    </>
  );

  const rightLinks = clerkUser && user ? (
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
            <AvatarFallback>{clerkUser.firstName?.charAt(0) || "U"}</AvatarFallback>
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
  );

  const mobileLinks = (
  <div className="flex flex-col gap-2">
    <Link
      to="/browse"
      onClick={() => setMobileOpen(false)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-[#c084fc]/20 transition"
    >
      <Compass size={16} /> Browse
    </Link>
    <Link
      to="/swap/requests"
      onClick={() => setMobileOpen(false)}
      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#c084fc]/20 transition border-b"
    >
      <RefreshCw size={16} /> Requests
    </Link>
    {clerkUser && user ? (
      <>
        <Link
          to={`/profile/${user?.id}`}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-[#c084fc]/20 transition"
        >
          <User size={16} /> My Profile
        </Link>
        <Link
          to="/my-listings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#c084fc]/20 transition border-b"
        >
          <LayoutList size={16} /> My Listings
        </Link>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              navigate("/new");
              setMobileOpen(false);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 w-1/2"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span className="leading-none">New</span>
          </Button>
          <SignOutButton>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-[#c084fc]/20 transition w-1/2 text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          </SignOutButton>
        </div>
      </>
    ) : (
      <SignInButton mode="modal">
        <Button
          onClick={() => setMobileOpen(false)}
          variant="default"
          className="w-full"
        >
          Login
        </Button>
      </SignInButton>
    )}
  </div>
);


  return (
    <nav className={navClasses}>
      <div className="flex items-center gap-3">
        <Logo />
        <div className="hidden md:flex items-center gap-3">{leftLinks}</div>
      </div>

      <div className="hidden md:flex items-center gap-3">{rightLinks}</div>
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-[#c084fc]/20 transition"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>


      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-[#2a202d]/100 border-t border-[#c084fc]/20 flex flex-col p-4 md:hidden space-y-2 z-40 rounded-md mt-3">
          {mobileLinks}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
