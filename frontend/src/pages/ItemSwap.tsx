import { useState } from "react";
import { useApp } from "@/stores/useApp";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/stores/useAuth";
import Item from "@/components/Item";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ItemType } from "@/lib/types";
import { useAuth as useClerkAuth } from '@clerk/clerk-react'
function ItemSwap() {
  const { id } = useParams();
  const { getItem, sendSwapPropsal } = useApp();
  const { user, fetchUser } = useAuth();
  const [isSending, setIsSending] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  const { getToken } = useClerkAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["swap-item", id],
    queryFn: async () => {

      const token = await getToken({ template: "default" });
      if (!id) throw new Error("No item ID provided");

      const res = await getItem(id, token);
      return res;
    },
    staleTime: 12000,
    enabled: !!id,
  });

  let selectedItem;
  if (selectedItemId) {
    selectedItem = user?.items?.find(
      (item: ItemType) => item.id === parseInt(selectedItemId)
    );
  }

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8 text-red-500">Failed to load item. Please try again.</div>;

  const handleSendProposal = async () => {
    const token = await getToken({ template: "default" });
    const proposalData = {
      proposedItemId: selectedItemId ?? undefined,
      receiverItemId: data?.id,
      message: message,
      receiverId: data?.userId,
    };
    setIsSending(true);
    await sendSwapPropsal(proposalData, token);
    fetchUser(token);
    setIsSending(false)
  }
  return (
    <div className="container p-8">
      <div className="mb-5 flex items-center gap-3">
        <Button variant={"outline"} onClick={() => navigate(`/item/${data?.id}`)}>
          <ArrowLeft />
        </Button>
        <h1 className="text-3xl font-bold">Propose a Swap</h1>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">Select an Item to Offer</h2>

              <Select onValueChange={(value) => setSelectedItemId(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose one of your items to offer" />
                </SelectTrigger>
                <SelectContent>
                  {user?.items?.length ? (
                    user.items.map((item) => (
                      <SelectItem value={item.id.toString()} key={item.id}>
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-6 h-6 object-cover rounded"
                          />
                          <span>{item.title}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-sm p-2 text-muted-foreground">No items available</div>
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-1/2">
                  {selectedItem ? (
                    <Item item={selectedItem} isBoost={false} />
                  ) : (
                    <div className="border rounded p-4 text-center text-muted-foreground">
                      <p>Select one of your items to offer</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center w-12 h-12">
                  <RefreshCw className="text-muted-foreground h-6 w-6" />
                </div>

                <div className="w-full sm:w-1/2">
                  {data ? (
                    <Item item={data} isBoost={false} />
                  ) : (
                    <div className="border rounded p-4 text-center text-muted-foreground">
                      <p>Loading requested item...</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Introduce yourself and explain why you're interested in this swap..."
                className="min-h-32"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" onClick={handleSendProposal} disabled={isSending}>
            {isSending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <div className="flex">
                <Send className="mr-2 h-4 w-4" />
                Send Swap Proposal
              </div>
            )}

          </Button>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Swap Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Fair Value Exchange</h3>
                <p className="text-sm">
                  Try to offer items of similar value. This increases the likelihood of your swap being accepted.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Be Descriptive</h3>
                <p className="text-sm">
                  Include details about your item's condition and why it would be a good swap in your message.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Response Time</h3>
                <p className="text-sm">
                  Most users respond to swap proposals within 48 hours. Be patient while waiting for a response.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Safety First</h3>
                <p className="text-sm">
                  If your swap is accepted, always meet in a public place and inspect items before completing the
                  exchange.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ItemSwap;
