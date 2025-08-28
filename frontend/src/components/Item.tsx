import { Loader2, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { ItemType, sendSwapRequestType } from "@/lib/types";
import { useAuth } from "@/stores/useAuth";
import { useState } from "react";
import { useApp } from "@/stores/useApp";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Item({ item, isSwap }: { item: ItemType; isSwap: boolean }) {
  const { user } = useAuth();
  const { sendSwapRequest } = useApp();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: number; type: "ITEM" | "SKILL" } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useClerkAuth();

  const handleSubmitSwap = async () => {
    if (!selected) return;
    setIsLoading(true);
    const token = await getToken({ template: "default" });

    const payload: sendSwapRequestType = {
      proposedId: selected.id,
      proposerType: selected.type,
      receiverId: item.userId,
      receivedId: item.id,
      receiverType: "ITEM",
    };

    await sendSwapRequest(payload, token);
    setIsLoading(false);
    setOpen(false);
    setSelected(null);
  };

  return (
    <div
      className="group relative w-[300px] grid grid-rows-[auto,1fr,auto] 
  bg-[#2a202d]/70 backdrop-blur-md border border-transparent 
  rounded-[28px] overflow-hidden shadow-md transition-transform 
  hover:scale-[1.02] hover:shadow-xl hover:border-purple-400"
    >
      <Link to={`/item/${item.id}`} className="block">
        <div className="relative h-[140px] overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute bottom-2.5 left-2.5 z-10 bg-[#c084fc] text-black rounded-full text-xs px-2 py-0.5">
            {item.category}
          </Badge>
        </div>

        <div className="px-3 pt-3 pb-7 space-y-2 text-white overflow-hidden">
          <h1 className="text-base font-semibold line-clamp-1">{item.title}</h1>

          <p className="text-sm text-white/80 flex items-center gap-1">
            <MapPin size={12} />
            {item.location || "Remote"}
          </p>

          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col text-sm text-white/80 leading-tight">
              <span className="text-xs text-white/50">Looking for</span>
              <span className="font-semibold text-white max-w-[140px] line-clamp-2">
                {item.lookingFor}
              </span>
            </div>
            <p className="text-lg font-bold text-white whitespace-nowrap">
              ₹{item.price.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            <Badge variant="default" className="text-xs capitalize">
              {item.condition.replace("_", " ").toLowerCase()}
            </Badge>
            <Badge variant="default" className="text-xs">
              {item.hasBill ? "Has Bill" : "No Bill"}
            </Badge>
          </div>
        </div>
      </Link>
      {isSwap ? (
        <div className="row-start-3 p-2 bg-white/5 backdrop-blur-sm">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full font-medium"
                onClick={(e) => e.stopPropagation()}
                disabled={item.isSwapped}
              >
                {item.isSwapped ? "Swapped" : "Swap"}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Select your item or skill to propose</DialogTitle>
              </DialogHeader>

              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                <p className="text-sm font-medium text-white/80">Your Items</p>
                {user?.items
                  .filter((i) => !i.isSwapped)
                  .map((i) => (
                    <Button
                      key={`item-${i.id}`}
                      variant={selected?.id === i.id && selected?.type === "ITEM" ? "default" : "outline"}
                      className="w-full justify-start text-left gap-2"
                      onClick={() => setSelected({ id: i.id, type: "ITEM" })}
                    >
                      <img
                        src={i.image || ""}
                        alt={i.title}
                        className="w-5 h-5 rounded object-cover"
                      />
                      {i.title}
                    </Button>
                  ))}

                <p className="text-sm font-medium text-white/80 pt-2">
                  Your Skills
                </p>
                {user?.skills.map((s) => (
                  <Button
                    key={`skill-${s.id}`}
                    variant={selected?.id === s.id && selected?.type === "SKILL" ? "default" : "outline"}
                    className="w-full justify-start text-left gap-2"
                    onClick={() => setSelected({ id: s.id, type: "SKILL" })}
                  >
                    {s.image && (
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-5 h-5 rounded object-cover"
                      />
                    )}
                    {s.title}
                  </Button>
                ))}
              </div>

              <Button
                className="mt-3 w-full"
                onClick={handleSubmitSwap}
                disabled={!selected || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : null}
                Send Swap Request
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="row-start-3" />
      )}
    </div>
  );
}

export default Item;
