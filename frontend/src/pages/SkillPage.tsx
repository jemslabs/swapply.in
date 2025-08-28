import { useApp } from "@/stores/useApp";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Clock, Loader2, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/stores/useAuth";
import { useState } from "react";
import type { sendSwapRequestType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SkillPage() {
  const { id } = useParams();
  const { getSkill, sendSwapRequest } = useApp();
  const { getToken } = useClerkAuth();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: number; type: "ITEM" | "SKILL" } | null>(null);
  const [isSending, setIsSending] = useState(false);

  const { data: skill, isLoading } = useQuery({
    queryKey: ["skill", id],
    queryFn: async () => {
      const token = await getToken({ template: "default" });
      return await getSkill(id, token);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-purple-400" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex justify-center items-center h-screen text-white/70">
        Skill not found
      </div>
    );
  }

  const handleSubmitSwap = async () => {
    if (!selected) return;
    setIsSending(true);

    const token = await getToken({ template: "default" });
    const payload: sendSwapRequestType = {
      proposedId: selected.id,
      proposerType: selected.type,
      receiverId: skill.userId,
      receivedId: skill.id,
      receiverType: "SKILL",
    };

    await sendSwapRequest(payload, token);

    setIsSending(false);
    setOpen(false);
    setSelected(null);
  };

  return (
    <div className="flex items-center justify-center h-screen px-6">
      <div className="flex w-full max-w-6xl h-[85vh] backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">


        <div className="flex-1 flex flex-col p-6 space-y-6">
          <div className="flex-1 flex">
            <img
              src={skill.image}
              alt={skill.title}
              className="h-full max-h-[420px] w-full object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-white">{skill.title}</h1>

            <p className="flex items-center gap-2 text-sm text-white/70">
              <MapPin size={14} /> {skill.location}
            </p>

            <div>
              <h3 className="text-sm font-medium text-white/60">Looking for</h3>
              <p className="text-lg font-semibold">{skill.lookingFor}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skill.category && (
                <Badge variant="default" className="flex items-center gap-1">
                  <Tag size={12} /> {skill.category}
                </Badge>
              )}
              <Badge variant="outline">
                {skill.isRemote ? "Remote" : "In-person"}
              </Badge>
              <Badge variant="default">{skill.duration} hrs</Badge>
            </div>
          </div>
        </div>


        <Card className="w-[340px] bg-[#2a202d]/70 border-l border-white/10 flex flex-col justify-between">
          <CardContent className="p-6 flex flex-col gap-6">
            <div>
              <p className="text-3xl font-bold flex items-center gap-2">
                <span><Clock size={16} className="text-gray-300" /></span>
                {skill.duration}h
              </p>
              <p className="text-xs text-white/60">
                Barter this skill with your items or skills
              </p>
            </div>

            <Link className="flex items-center gap-3 hover:bg-[#2a202d]/90 p-3 rounded-xl" to={`/profile/${skill.user?.id}`}>
              <img
                src={skill.user?.image}
                alt={skill.user?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  {skill.user?.name}
                </p>
                <p className="text-xs text-white/60">{skill.user?.email}</p>
              </div>
            </Link>
            {skill.user?.id !== user?.id && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Propose Swap
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
                          variant={
                            selected?.id === i.id && selected?.type === "ITEM"
                              ? "default"
                              : "outline"
                          }
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
                        variant={
                          selected?.id === s.id && selected?.type === "SKILL"
                            ? "default"
                            : "outline"
                        }
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
                    disabled={!selected || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="animate-spin mr-2" size={16} />
                    ) : null}
                    Send Swap Request
                  </Button>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SkillPage;
