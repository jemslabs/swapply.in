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

  const navLinks = [
    {
      name: "Browse",
      to: "/browse",
      icon: <Compass className="w-3 h-3" />,
    },
    {
      name: "Circles",
      to: "/circles",
      icon: <Users className="w-3 h-3" />
    }
  ];

  return (
    <div className="fixed top-5 left-20 right-10 z-50 bg-[#000000] border border-[#2a2a2a] rounded-xl">
      <div className="py-2 px-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Logo />


          <div className="flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  "flex items-center gap-2 text-sm px-3 py-1 rounded-md hover:bg-[#1a1a1a] transition",
                  location.pathname === link.to
                    ? "bg-[#1a1a1a] text-white"
                    : "text-white"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

        </div>
        <div className="flex items-center gap-2">

          {user ? (
            <>
              <Link to={'/item/add'}>
                <Button variant={"outline"}><Plus /> List Item</Button>
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
                      <Link to="/profile" className="flex items-center gap-2">
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
              <Link to={"/login"}>
                <Button>Login</Button>
              </Link>
              <Link to={"/signup"}>
                <Button variant={"outline"}>Signup</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
