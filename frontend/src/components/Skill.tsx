import { Clock, Loader2, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import type { SkillType, sendSwapRequestType } from "@/lib/types";
import { useAuth } from "@/stores/useAuth";
import { useState } from "react";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useApp } from "@/stores/useApp";


function Skill({ skill, isSwap }: { skill: SkillType, isSwap: boolean }) {
  const { user } = useAuth();
  const { sendSwapRequest } = useApp();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useClerkAuth();
  const handleSubmitSwap = async () => {
    setIsLoading(true)
    const token = await getToken({ template: "default" });
    if (!selectedId) return;

    const isItem = user?.items.some(i => i.id === selectedId);
    const isSkill = user?.skills.some(s => s.id === selectedId);

    if (!isItem && !isSkill) return;

    const updatedSwapData: sendSwapRequestType = {
      proposedId: selectedId,
      proposerType: isItem ? "ITEM" : "SKILL",
      receiverId: skill.userId,
      receivedId: skill.id,
      receiverType: "SKILL",
    };
    await sendSwapRequest(updatedSwapData, token);
    setIsLoading(false)
  };

  return (
    <div className="relative w-[250px] bg-[#2a202d]/70 backdrop-blur-md border border-white/10 rounded-[28px] cursor-pointer overflow-hidden shadow-md">
      <div className="relative h-[140px] overflow-hidden rounded-[28px]">
        <img
          src={skill.image}
          alt={skill.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute bottom-2.5 left-2.5 z-10 bg-[#c084fc] text-black rounded-full text-xs px-2 py-0.5">
          {skill.category}
        </Badge>
      </div>

      <div className="relative px-3 pt-3 pb-16 space-y-2 text-white">
        <h1 className="text-base font-semibold line-clamp-1">{skill.title}</h1>
        <p className="text-sm text-white/80 flex items-center gap-1">
          <MapPin size={12} />
          {skill.isRemote ? "Remote" : skill.location}
        </p>

        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col text-sm text-white/80 leading-tight">
            <span className="text-xs text-white/50">Looking for</span>
            <span className="font-semibold text-white max-w-[140px]">
              {skill.lookingFor}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-sm text-white/80">
                <Clock size={14} />
                <span>{skill.duration}h</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Duration in hours
            </TooltipContent>
          </Tooltip>
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
              <Button className="text-xs px-3 py-1 h-auto flex-1">
                Swap
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
                    className="w-full justify-start text-left gap-2"
                    onClick={() => setSelectedId(s.id)}
                  >
                    <img src={s.image || ""} alt={s.title} className="w-5 h-5 rounded object-cover" />
                    {s.title}
                  </Button>
                ))}
              </div>
              <Button className="mt-3 w-full" onClick={handleSubmitSwap} disabled={!selectedId || isLoading}>
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

export default Skill;
