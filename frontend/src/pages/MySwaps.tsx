import { useAuth } from "@/stores/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, RefreshCw, Trash2, ChevronRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/stores/useApp";
import { useState } from "react";

function MySwaps() {
  const { user, fetchUser } = useAuth();
  const { acceptSwapProposal, rejectSwapProposal, cancelSwapProposal } =
    useApp();
  const [loadingSwapId, setLoadingSwapId] = useState<string | number | null>(
    null
  );
  const navigate = useNavigate();

  function handleProceed(swapId: string | number) {
    navigate(`/swap/${swapId}`);
  }
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="flex items-center gap-1 text-xs bg-green-500">
            <Check className="w-3 h-3" /> Accepted
          </Badge>
        );
      case "DECLINED":
        return (
          <Badge
            variant="destructive"
            className="flex items-center gap-1 text-xs"
          >
            <X className="w-3 h-3" /> Declined
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="destructive"
            className="flex items-center gap-1 text-xs"
          >
            <X className="w-3 h-3" /> Canceled
          </Badge>
        );
      default:
        return null;
    }
  };

  async function handleAcceptSwapProposal(id: string | number) {
    setLoadingSwapId(id);
    await acceptSwapProposal(id);
    fetchUser();
    setLoadingSwapId(null);
  }

  async function handleRejectSwapProposal(id: string | number) {
    setLoadingSwapId(id);
    await rejectSwapProposal(id);
    fetchUser();
    setLoadingSwapId(null);
  }

  async function handleCancelSwapProposal(id: string | number) {
    setLoadingSwapId(id);
    await cancelSwapProposal(id);
    fetchUser();
    setLoadingSwapId(null);
  }
  return (
    <div className="px-4 py-4 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-2 sm:gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-2xl font-bold tracking-tight">
          Your Swap Offers
        </h1>
      </div>


      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="incoming">Incoming Offers</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Offers</TabsTrigger>
        </TabsList>


        {/* Incoming Offers */}
        <TabsContent value="incoming" className="mt-6">
          {user?.receivedSwaps?.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No incoming offers
            </p>
          ) : (
            <div className="space-y-10">
              {user?.receivedSwaps.map((swap) => (
                <Card
                  key={swap.id}
                  className="gap-2 p-3 border rounded-lg shadow-sm"
                >
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-2 overflow-auto w-full sm:w-auto">
                      <div className="flex items-center gap-2 w-full sm:w-[160px]">
                        <Avatar>
                          <AvatarImage src={swap.proposer.image || undefined} />
                          <AvatarFallback>
                            {swap.proposer.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <p className="font-medium">{swap.proposer.name}</p>
                          <p className="text-muted-foreground text-[10px]">
                            sent a swap
                          </p>
                        </div>
                      </div>
                      <div className="border rounded-lg p-3 w-[200px]">
                        <Link
                          to={`/item/${swap.proposedItem.id}`}
                          className="flex items-center gap-2 text-sm hover:underline"
                        >
                          <img
                            src={swap.proposedItem.image}
                            alt={swap.proposedItem.title}
                            className="w-7 h-7 object-cover rounded"
                          />
                          <span className="font-medium leading-none">
                            {swap.proposedItem.title}
                          </span>
                        </Link>
                      </div>
                      <RefreshCw className="w-3 h-3 text-muted-foreground" />
                      <div className="border rounded-lg p-3 w-[200px]">
                        <Link
                          to={`/item/${swap.receiverItem.id}`}
                          className="flex items-center gap-2 text-sm hover:underline"
                        >
                          <img
                            src={swap.receiverItem.image}
                            alt={swap.receiverItem.title}
                            className="w-7 h-7 object-cover rounded"
                          />
                          <span className="font-medium leading-none">
                            {swap.receiverItem.title}
                          </span>
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 w-full sm:w-[130px]">
                      {renderStatusBadge(swap.status)}
                      {swap.status === "ACCEPTED" && (
                        <div className="flex gap-3 items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelSwapProposal(swap.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center"
                            onClick={() => handleProceed(swap.id)}
                          >
                            Proceed <ChevronRight className="h-3 w-3 mr-1" />
                          </Button>

                        </div>

                      )}

                      {swap.status === "PENDING" && (
                        <div className="flex flex-wrap gap-1">
                          {loadingSwapId === swap.id ? (
                            <Button
                              disabled
                              size="sm"
                              className="h-6 px-2 text-[10px]"
                            >
                              <RefreshCw className="h-3 w-3 animate-spin mr-1" />{" "}
                              Processing
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                className="h-6 px-2 text-[10px]"
                                onClick={() =>
                                  handleAcceptSwapProposal(swap.id)
                                }
                              >
                                <Check className="h-3 w-3 mr-1" /> Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-6 px-2 text-[10px]"
                                onClick={() =>
                                  handleRejectSwapProposal(swap.id)
                                }
                              >
                                <X className="h-3 w-3 mr-1" /> Decline
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                    <div>
                      <h1 className="font-medium mb-1">Message:</h1>
                      <p className="text-muted-foreground">{swap?.message}</p>
                    </div>


                  </div>

                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="outgoing" className="mt-6">
          {user?.proposedSwaps?.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No outgoing offers
            </p>
          ) : (
            <div className="space-y-3">
              {user?.proposedSwaps.map((swap) => (
                <Card
                  key={swap.id}
                  className="gap-2 p-3 border rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 w-[160px] min-w-[140px]">
                      <Avatar>
                        <AvatarImage src={user?.image || undefined} />
                        <AvatarFallback>
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-[10px]">
                          you sent a swap
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3 w-[200px]">
                      <Link
                        to={`/item/${swap.proposedItem.id}`}
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <img
                          src={swap.proposedItem.image}
                          alt={swap.proposedItem.title}
                          className="w-7 h-7 object-cover rounded"
                        />
                        <span className="font-medium leading-none">
                          {swap.proposedItem.title}
                        </span>
                      </Link>
                    </div>

                    <RefreshCw className="w-3 h-3 text-muted-foreground" />

                    <div className="border rounded-lg p-3 w-[200px]">
                      <Link
                        to={`/item/${swap.receiverItem.id}`}
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <img
                          src={swap.receiverItem.image}
                          alt={swap.receiverItem.title}
                          className="w-7 h-7 object-cover rounded"
                        />
                        <span className="font-medium leading-none">
                          {swap.receiverItem.title}
                        </span>
                      </Link>
                    </div>

                    <div className="flex flex-col items-end sm:items-end gap-2 w-[160px] min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-right">
                          <p className="font-medium">{swap.receiver.name}</p>
                          <p className="text-muted-foreground text-[10px]">
                            receiver
                          </p>
                        </div>
                        <Avatar>
                          <AvatarImage src={swap.receiver.image || undefined} />
                          <AvatarFallback>
                            {swap.receiver.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {renderStatusBadge(swap.status)}
                      {swap.status === "ACCEPTED" && (
                        <div className="flex gap-3 items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelSwapProposal(swap.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center"
                            onClick={() => handleProceed(swap.id)}
                          >
                            Proceed <ChevronRight className="h-3 w-3 mr-1" />
                          </Button>

                        </div>

                      )}
                      {swap.status === "PENDING" &&
                        (loadingSwapId === swap.id ? (
                          <Button
                            disabled
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                          >
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />{" "}
                            Processing
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => handleCancelSwapProposal(swap.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Cancel Swap
                          </Button>
                        ))}
                    </div>
                  </div>

                  <Separator />
                  <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                    <div>
                      <h1 className="font-medium mb-1">Message:</h1>
                      <p className="text-muted-foreground">{swap?.message}</p>
                    </div>

                  </div>

                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MySwaps;
