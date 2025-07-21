import { useAuth } from "@/stores/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ItemType, SkillType } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import { useApp } from "@/stores/useApp";
import { useState } from "react";
function MiniItem({ item }: { item: ItemType }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/10 w-fit">
      <img
        src={item.image}
        alt={item.title}
        className="w-10 h-10 rounded object-cover"
      />
      <div className="text-white text-sm">
        <p className="font-medium line-clamp-1">{item.title}</p>
        <p className="text-white/60 text-xs">₹{item.price.toLocaleString()}</p>
      </div>
    </div>
  );
}
function MiniSkill({ skill }: { skill: SkillType }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/10 w-fit">
      <img
        src={skill.image}
        alt={skill.title}
        className="w-10 h-10 rounded object-cover"
      />
      <div className="text-white text-sm">
        <p className="font-medium line-clamp-1">{skill.title}</p>
        <p className="text-white/60 text-xs line-clamp-1 max-w-[140px]">
          {skill.isRemote ? "Remote" : skill.location}
        </p>
      </div>
    </div>
  );
}

function SwapRequests() {
  const { getToken } = useClerkAuth();
  const { getSwapRequests } = useAuth();
  const { acceptSwapRequest, rejectSwapRequest } = useApp();
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["swap-requests"],
    queryFn: async () => {
      const token = await getToken({ template: "default" });
      return await getSwapRequests(token);
    },
    staleTime: 12000,
  });

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (!data) return <div className="text-white">No data</div>;

  const { receivedSwaps, proposedSwaps } = data;

  const handleAcceptSwapRequest = async (swapId: number) => {
    setAcceptingId(swapId);
    const token = await getToken({ template: "default" });
    await acceptSwapRequest(swapId, token);
    setAcceptingId(null);
  };

  const handleRejectSwapRequest = async (swapId: number) => {
    setRejectingId(swapId);
    const token = await getToken({ template: "default" });
    await rejectSwapRequest(swapId, token);
    setRejectingId(null);
  };


  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Swap Requests</h1>
      </div>
      {receivedSwaps.length === 0 && proposedSwaps.length === 0 && (
        <p className="text-white/60 text-sm mt-10">No swap requests yet.</p>
      )}

      <Tabs className="w-full" defaultValue="received">
        <TabsList className="w-full sm:w-[300px]">
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent
          value="received"
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {receivedSwaps.map((swap) => (
            <div
              key={swap.id}
              className="border border-white/10 bg-white/5 rounded-xl p-4 flex gap-4 items-start"
            >
              <img
                src={swap.proposer.image}
                alt={swap.proposer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between">
                  <p className="text-white font-medium">{swap.proposer.name}</p>
                  <div className="flex gap-2">
                    <Button
                      variant={"ghost"}
                      className="text-green-400 hover:text-green-300 transition  rounded-full bg-green-500/10 "
                      onClick={() => handleAcceptSwapRequest(swap.id)}
                      disabled={acceptingId === swap.id}
                    >
                      {acceptingId === swap.id ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </Button>

                    <Button
                      variant={"ghost"}
                      className="text-red-400 hover:text-red-300 transition rounded-full bg-red-500/10"
                      onClick={() => handleRejectSwapRequest(swap.id)}
                      disabled={rejectingId === swap.id}
                    >
                      {rejectingId === swap.id ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </Button>

                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-white/70 text-sm mb-1">wants to swap:</p>
                    <div className="space-y-2 mt-1">
                      {swap.proposerSkill && (
                        <MiniSkill skill={swap.proposerSkill} />
                      )}
                      {swap.proposerItem && (
                        <MiniItem item={swap.proposerItem} />
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-white/70 text-sm mb-1">For your:</p>
                    <div className="space-y-2 mt-1">
                      {swap.receiverItem && (
                        <MiniItem item={swap.receiverItem} />
                      )}
                      {swap.receiverSkill && (
                        <MiniSkill skill={swap.receiverSkill} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent
          value="sent"
          className="space-y-4 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {proposedSwaps.length === 0 ? (
            <p className="text-white/60 text-sm">No sent swaps.</p>
          ) : (
            proposedSwaps.map((swap) => (
              <div
                key={swap.id}
                className="border border-white/10 bg-white/5 rounded-xl p-4 flex gap-4 items-start"
              >
                <div>
                  <p className="text-white font-medium mb-1">You proposed:</p>
                  {swap.proposerSkill && (
                    <MiniSkill skill={swap.proposerSkill} />
                  )}
                  {swap.proposerItem && <MiniItem item={swap.proposerItem} />}

                  <p className="text-white/70 text-sm mt-3 mb-1">To get:</p>
                  {swap.receiverItem && <MiniItem item={swap.receiverItem} />}
                  {swap.receiverSkill && (
                    <MiniSkill skill={swap.receiverSkill} />
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SwapRequests;
