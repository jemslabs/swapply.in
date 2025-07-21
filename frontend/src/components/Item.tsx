import { Loader2, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "./ui/dialog";
import type { ItemType, sendSwapRequestType } from "@/lib/types";
import { useAuth } from "@/stores/useAuth";
import { useState } from "react";
import { useApp } from "@/stores/useApp";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";

function Item({ item, isSwap }: { item: ItemType, isSwap: boolean }) {
    const { user } = useAuth();
    const { sendSwapRequest } = useApp();
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { getToken } = useClerkAuth();
    const handleSubmitSwap = async () => {
        setIsLoading(true)
        const token = await getToken({ template: "default"});
        if (!selectedId) return;

        const isItem = user?.items.some(i => i.id === selectedId);
        const isSkill = user?.skills.some(s => s.id === selectedId);

        if (!isItem && !isSkill) return;

        const updatedSwapData: sendSwapRequestType = {
            proposedId: selectedId,
            proposerType: isItem ? "ITEM" : "SKILL",
            receiverId: item.userId,
            receivedId: item.id,
            receiverType: "ITEM",
        };
        await sendSwapRequest(updatedSwapData, token);
        setIsLoading(false)
    };


    return (
        <div className="relative w-[250px] bg-[#2a202d]/70 backdrop-blur-md border border-white/10 rounded-[28px] cursor-pointer overflow-hidden shadow-md">
            <div className="relative h-[140px] overflow-hidden rounded-[28px]">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
                <Badge className="absolute bottom-2.5 left-2.5 z-10 bg-[#c084fc] text-black rounded-full text-xs px-2 py-0.5">
                    {item.category}
                </Badge>
            </div>

            <div className="relative px-3 pt-3 pb-16 space-y-2 text-white">
                <h1 className="text-base font-semibold line-clamp-1">{item.title}</h1>

                <p className="text-sm text-white/80 flex items-center gap-1">
                    <MapPin size={12} />
                    {item.location || "Remote"}
                </p>

                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col text-sm text-white/80 leading-tight">
                        <span className="text-xs text-white/50">Looking for</span>
                        <span className="font-semibold text-white  max-w-[140px]">
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

            <div className="absolute bottom-0 inset-x-0 p-2 bg-white/5 backdrop-blur-sm rounded-b-[28px] flex justify-between items-center gap-2">
                <Button
                    variant="outline"
                    className="text-xs px-3 py-1 h-auto flex-1"
                    onClick={() => { /* handle view */ }}
                >
                    View
                </Button>
                {isSwap && 
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="text-xs px-3 py-1 h-auto flex-1"
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
                                        variant={selectedId === i.id ? "default" : "outline"}
                                        className="w-full justify-start text-left gap-2"
                                        onClick={() => setSelectedId(i.id)}
                                    >
                                        <img src={i.image || ""} alt={i.title} className="w-5 h-5 rounded object-cover" />
                                        {i.title}
                                    </Button>
                                ))}

                            <p className="text-sm font-medium text-white/80 pt-2">Your Skills</p>
                            {user?.skills.map((s) => (
                                <Button
                                    key={`skill-${s.id}`}
                                    variant={selectedId === s.id ? "default" : "outline"}
                                    className="w-full justify-start text-left"
                                    onClick={() => setSelectedId(s.id)}
                                >
                                    <img src={s.image ? s.image : ""} className="w-5 h-5 rounded object-cover" />{s.title}
                                </Button>
                            ))}
                        </div>
                        <Button className="mt-3 w-full" onClick={handleSubmitSwap}  disabled={!selectedId || isLoading}>
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                            Send Swap Request
                        </Button>
                    </DialogContent>
                </Dialog>
}
            </div>
        </div>
    );
}

export default Item;
