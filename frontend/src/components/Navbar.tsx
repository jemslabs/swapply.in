import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "@/stores/useAuth";
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
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "./ui/separator";
import clsx from "clsx";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const bgClass = clsx(
    "fixed top-5 left-20 right-10 z-50 border rounded-xl transition-colors duration-300",
    {
      "bg-[#000000] border-[#2a2a2a]": !location.pathname.startsWith("/login") &&
        !location.pathname.startsWith("/signup"),
      "bg-transparent border-transparent": location.pathname.startsWith("/login") ||
        location.pathname.startsWith("/signup"),
    }
  );

  return (
    <div className={bgClass}>
      <div className="py-2 px-4 flex justify-between items-center">

        <div className="flex items-center gap-6">
          <Logo />

          <div className="flex gap-4">

            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={clsx(
                    "flex items-center gap-2 text-sm px-3 py-1 rounded-md hover:bg-[#1a1a1a] transition cursor-pointer",
                    location.pathname.startsWith("/browse")
                      ? "bg-[#1a1a1a] text-white"
                      : "text-white"
                  )}>
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

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/item/add">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  List Item
                </Button>
              </Link>


              <Link to="/notifications" className="relative">
                <Bell className="h-6 w-6 hover:text-gray-300" />
                {user.notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
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
                      <Link to={`/profile/${user?.id}`} className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/my-items" className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>My Items</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/my-swaps" className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        <span>My Swaps</span>
                      </Link>
                    </Button>
                    <Separator />
                    <Button
                      variant="ghost"
                      className="w-full justify-start flex items-center gap-2"
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
            <div className="flex gap-2">
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="sm">
                  Signup
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
