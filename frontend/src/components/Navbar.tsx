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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

import Logo from "./Logo";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isPro = !!user?.plan;

  const bgClass = clsx(
    "fixed top-2 left-5 right-5 z-50 border rounded-xl transition-colors duration-300",
    {
      "bg-[#000000] border-[#2a2a2a]":
        !location.pathname.startsWith("/login") &&
        !location.pathname.startsWith("/signup"),
    }
  );

  return (
    <nav className={bgClass}>
      <div className="py-2 px-4 flex justify-between items-center">
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
                </div>
              </PopoverTrigger>
              <PopoverContent className="space-y-2 p-2">
                <Link
                  to="/browse/items"
                  className={clsx(
                    "flex gap-5 items-center p-2 rounded-md transition",
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
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/item/add">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  List Item
                </Button>
              </Link>

              {isPro ? (
                <Button size="sm" variant={"default"}>
                  <Crown className="w-4 h-4" />
                  Pro
                </Button>
              ) : (

                <Button size="sm" asChild>
                  <Link to="/pricing">
                    Upgrade
                  </Link>
                </Button>
              )}
              <Link to="/notifications" className="relative">
                <Bell className="h-5 w-5 hover:text-gray-300" />
                {user.notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {user.notifications.length}
                  </span>
                )}
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon">
                    <User className="h-5 w-5" />
                  </Button>
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
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => logout()}
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">Logout</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="outline">
                  Signup
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-4">
              <div className="flex flex-col gap-3 text-white text-sm">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                  <Library className="w-4 h-4" />
                  Discover Items
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                  <Users className="w-4 h-4" />
                  Join Circles
                </div>

                {user ? (
                  <>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                      <Users className="w-4 h-4" />
                      Circles
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                      <Plus className="w-4 h-4" />
                      List Item
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                      <Bell className="w-4 h-4" />
                      Notifications
                      {user.notifications?.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {user.notifications.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                      <User className="w-4 h-4" />
                      Profile
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                      <Package className="w-4 h-4" />
                      My Items
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                      <RefreshCw className="w-4 h-4" />
                      My Swaps
                    </div>
                    <Separator />
                    <div
                      onClick={logout}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                      <User className="w-4 h-4" />
                      Login
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition cursor-pointer">
                      <User className="w-4 h-4" />
                      Signup
                    </div>
                  </>
                )}
              </div>
            </SheetContent>

          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
