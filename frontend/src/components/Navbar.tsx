import { useState } from "react";
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

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isPro = !!user?.plan;

  const bgClass = clsx(
    "fixed top-2 left-5 right-5 z-50 border rounded-xl transition-colors duration-300 bg-[#000000]",
    {
      "bg-[#000000] border-[#2a2a2a]":
        !location.pathname.startsWith("/login") &&
        !location.pathname.startsWith("/signup"),
    }
  );

  return (
    <>
      <nav className={bgClass}>
        <div className="py-2 px-4 flex justify-between items-center">
          {/* Left: Logo + Desktop Nav */}
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

          {/* Right: Desktop Auth + Mobile Menu */}
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
                  ""
                ) : (
                  <Button size="sm" asChild>
                    <Link to="/pricing">Upgrade</Link>
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
                    logout();
                    setSidebarOpen(false);
                  }}
                  className="flex gap-2 items-center px-2 py-2 text-red-500 rounded hover:bg-[#222]"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white px-2 py-2 rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="text-white px-2 py-2 rounded hover:bg-[#222]" onClick={() => setSidebarOpen(false)}>
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
