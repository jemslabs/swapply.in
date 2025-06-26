import { useState } from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { loginData } from "@/lib/types";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/stores/useAuth";
import clsx from "clsx";

import {
  LogOut,
  Package,
  RefreshCw,
  User,
  Compass,
  Plus,
  Users,
  Bell,
  Library,
  Crown,
  Menu,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import Logo from "./Logo";
import { SignInButton } from "@clerk/clerk-react";
function Navbar() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isPro = !!user?.plan;
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
      clerkId: clerkUser.id || ""
    };

    handleSyncUser(userData);

    async function handleSyncUser(data: loginData) {
      await login(data);
      navigate("/browse/items");
    }
  }, [isSignedIn, clerkUser, isLoaded, user]);

  const bgClass = clsx(
    "fixed top-2 left-10 right-10 z-50 border-2 rounded-4xl transition-colors duration-300 bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] border-[#2a2a2a]"
  );

  return (
    <>
      <nav className={bgClass}>

        <div className="py-2 px-7 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="hidden md:flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    className={clsx(
                      "flex items-center gap-2 text-sm px-3 py-1 rounded-md hover:bg-[#1a1a1a] transition cursor-pointer",
                      location.pathname.startsWith("/browse")
                        ? "bg-[#1a1a1a] text-white"
                        : "text-white"
                    )}
                  >
                    <Compass className="w-3 h-3" />
                    Browse
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="space-y-2 p-2 bg-[#0d0d0d]">
                  <Link
                    to="/browse/items"
                    className={clsx(
                      "flex gap-5 items-center p-2 rounded-md transition ",
                      location.pathname === "/browse/items"
                        ? "bg-muted text-white"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="border rounded-md p-2 bg-muted">
                      <Library className="w-4 h-4" />
                    </div>
                    <span>Discover Items</span>
                  </Link>
                  <Link
                    to="/browse/circles"
                    className={clsx(
                      "flex gap-5 items-center p-2 rounded-md transition",
                      location.pathname === "/browse/circles"
                        ? "bg-muted text-white"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="border rounded-md p-2 bg-muted">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>Join Circles</span>
                  </Link>
                </PopoverContent>
              </Popover>
              {clerkUser && 
              <Link
                to="/circles"
                className={clsx(
                  "flex items-center gap-2 text-sm px-3 py-1 rounded-md hover:bg-[#1a1a1a] transition",
                  location.pathname === "/circles"
                    ? "bg-[#1a1a1a] text-white"
                    : "text-white"
                )}
              >
                <Users className="w-3 h-3" />
                Circles
              </Link>}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {clerkUser ? (
              <>
                <Link to="/item/add">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    List Item
                  </Button>
                </Link>
                {isPro ? (
                  ""
                ) : (
                  <Button size="sm" asChild>
                    <Link to="/pricing">Upgrade</Link>
                  </Button>
                )}
                <Link to="/notifications" className="relative">
                  <Bell className="h-5 w-5 hover:text-gray-300" />
                  {user && user.notifications?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {user.notifications.length}
                    </span>
                  )}
                </Link>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Button size="icon" className="relative group">
                        <User className="h-5 w-5 " />
                        {isPro && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-bold px-1.5 py-[1px] rounded-md shadow-md group-hover:scale-105 transition-transform">
                            PRO
                          </span>
                        )}
                      </Button>
                    </div>

                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-2">
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link to={`/profile/${user?.id}`}>
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link to="/my-items">
                          <Package className="w-4 h-4" />
                          <span>My Items</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link to="/my-swaps">
                          <RefreshCw className="w-4 h-4" />
                          <span>My Swaps</span>
                        </Link>
                      </Button>
                      <Separator />
                      <SignOutButton>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-500 cursor-pointer h-10"
                        >
                          <LogOut className="w-5 h-5 mr-2 text-red-500" />
                          Logout
                        </Button>
                      </SignOutButton>

                    </div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button size="default">Login</Button>
                </SignInButton>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </nav>
      {/* Mobile Sidebar */}

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 md:hidden">
          <div className="w-64 bg-[#111] h-full shadow-lg p-4 space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                ✕
              </Button>
            </div>

            <Link to="/browse/items" className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
              <Library className="w-4 h-4" /> Discover Items
            </Link>
            <Link to="/browse/circles" className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
              <Users className="w-4 h-4" /> Join Circles
            </Link>
            <Link to="/circles" className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
              <Users className="w-4 h-4" /> Circles
            </Link>

            <Separator />

            {user ? (
              <>
                <Link to="/item/add" className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
                  <Plus className="w-4 h-4" /> List Item
                </Link>
                {isPro ? (
                  ""
                ) : (
                  <Link to="/pricing" className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
                    <Crown className="w-4 h-4" /> Upgrade
                  </Link>
                )}
                <Link to="/notifications" className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
                  <Bell className="w-4 h-4" /> Notifications
                </Link>
                <Link to={`/profile/${user.id}`} className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
                  <User className="w-4 h-4" /> Profile
                </Link>
                <Link to="/my-items" className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
                  <Package className="w-4 h-4" /> My Items
                </Link>
                <Link to="/my-swaps" className="flex gap-2 items-center px-2 py-2 text-white rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
                  <RefreshCw className="w-4 h-4" /> My Swaps
                </Link>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                  }}
                  className="flex gap-2 items-center px-2 py-2 text-red-500 rounded hover:bg-[#222]"
                >
                  <LogOut className="w-4 h-4" /> <SignOutButton />
                </button>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button size="sm" onClick={() => setSidebarOpen(false)}>Login</Button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
