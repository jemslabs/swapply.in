import { useAuth } from "@/stores/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronRight, Loader2, X } from "lucide-react";
import { useApp } from "@/stores/useApp";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import MiniSkill from "@/components/MiniSkill";
import MiniItem from "@/components/MiniItem";

function SwapRequests() {
  const { getToken } = useClerkAuth();
  const { getSwapRequests } = useAuth();
  const { acceptSwapRequest, rejectSwapRequest } = useApp();
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["swap-requests"],
    queryFn: async () => {
      const token = await getToken({ template: "default" });
      return await getSwapRequests(token);
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border border-white/10 bg-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start animate-pulse"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-3 w-full">
              <div className="h-4 w-1/2 bg-white/10 rounded" />
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-10 w-full bg-white/10 rounded" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-10 w-full bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return <div className="text-white p-6">No data</div>;

  const { receivedSwaps, proposedSwaps } = data;

  const handleAcceptSwapRequest = async (swapId: number) => {
    setAcceptingId(swapId);
    const token = await getToken({ template: "default" });
    await acceptSwapRequest(swapId, token);
    queryClient.invalidateQueries({ queryKey: ["swap-requests"] });
    setAcceptingId(null);
  };

  const handleRejectSwapRequest = async (swapId: number) => {
    setRejectingId(swapId);
    const token = await getToken({ template: "default" });
    await rejectSwapRequest(swapId, token);
    queryClient.invalidateQueries({ queryKey: ["swap-requests"] });
    setRejectingId(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Swap Requests
        </h1>
      </div>

      <Tabs className="w-full" defaultValue="received">
        <TabsList className="w-full sm:w-[300px]">
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        {/* Received Swaps */}
        <TabsContent
          value="received"
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {receivedSwaps.length === 0 ? (
            <p className="text-white/60 text-sm">No received swaps.</p>
          ) : (
            receivedSwaps.map((swap) => (
              <div
                key={swap.id}
                className="border border-white/10 bg-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start"
              >
                <img
                  src={swap.proposer.image}
                  alt={swap.proposer.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-start sm:items-center flex-wrap gap-2">
                    <p className="text-white font-medium">{swap.proposer.name}</p>
                    <div className="flex gap-2 flex-wrap">
                      {(swap.status === "ACCEPTED" ||
                        swap.status === "COMPLETED") && (
                        <Link to={`/swap/${swap.id}`}>
                          <Button size="sm">
                            Continue <ChevronRight />
                          </Button>
                        </Link>
                      )}
                      {swap.status === "REJECTED" && (
                        <Button variant="ghost" className="text-red-400">
                          Rejected
                        </Button>
                      )}
                      {swap.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            className="text-green-400 hover:text-green-300 transition rounded-full bg-green-500/10"
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
                            variant="ghost"
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
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-2">
                    <div className="flex-1">
                      <p className="text-white/70 text-sm mb-1">Wants to swap:</p>
                      <div className="space-y-2 mt-1">
                        {swap.proposerSkill && <MiniSkill skill={swap.proposerSkill} />}
                        {swap.proposerItem && <MiniItem item={swap.proposerItem} />}
                      </div>
                    </div>
                    <div className="flex-1 mt-4 sm:mt-0">
                      <p className="text-white/70 text-sm mb-1">For your:</p>
                      <div className="space-y-2 mt-1">
                        {swap.receiverItem && <MiniItem item={swap.receiverItem} />}
                        {swap.receiverSkill && <MiniSkill skill={swap.receiverSkill} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Sent Swaps */}
        <TabsContent
          value="sent"
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {proposedSwaps.length === 0 ? (
            <p className="text-white/60 text-sm">No sent swaps.</p>
          ) : (
            proposedSwaps.map((swap) => (
              <div
                key={swap.id}
                className="border border-white/10 bg-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start"
              >
                <img
                  src={swap.receiver.image}
                  alt={swap.receiver.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-start sm:items-center flex-wrap gap-2">
                    <p className="text-white font-medium">
                      Swap proposed to {swap.receiver.name}
                    </p>
                    {(swap.status === "ACCEPTED" ||
                      swap.status === "COMPLETED") && (
                      <Link to={`/swap/${swap.id}`}>
                        <Button size="sm">
                          Continue <ChevronRight />
                        </Button>
                      </Link>
                    )}
                    {swap.status === "REJECTED" && (
                      <Button variant="ghost" className="text-red-400">
                        Rejected
                      </Button>
                    )}
                    {swap.status === "PENDING" && (
                      <Badge className="bg-yellow-500 text-white">Pending</Badge>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-2">
                    <div className="flex-1">
                      <p className="text-white/70 text-sm mb-1">You offered:</p>
                      <div className="space-y-2 mt-1">
                        {swap.proposerSkill && <MiniSkill skill={swap.proposerSkill} />}
                        {swap.proposerItem && <MiniItem item={swap.proposerItem} />}
                      </div>
                    </div>
                    <div className="flex-1 mt-4 sm:mt-0">
                      <p className="text-white/70 text-sm mb-1">In exchange for:</p>
                      <div className="space-y-2 mt-1">
                        {swap.receiverItem && <MiniItem item={swap.receiverItem} />}
                        {swap.receiverSkill && <MiniSkill skill={swap.receiverSkill} />}
                      </div>
                    </div>
                  </div>
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
