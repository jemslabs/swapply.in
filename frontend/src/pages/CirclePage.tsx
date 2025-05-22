import Item from "@/components/Item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { memberType } from "@/lib/types";
import { useApp } from "@/stores/useApp";
import { useAuth } from "@/stores/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Users } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function CirclePage() {
  const { id } = useParams();
  const { fetchCircle, joinCircle, leaveCircle } = useApp();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["circle", id],
    queryFn: async () => {
      const res = await fetchCircle(id);
      return res;
    },
    staleTime: 12000,
    enabled: !!id,
  });

  const isJoined = data?.members?.find((member) => member?.userId === user?.id);
  const handleJoinCircle = async (circleId: number | undefined | string) => {
    setIsJoining(true)
    await joinCircle(circleId)
    await queryClient.invalidateQueries({ queryKey: ["circle", id] })
    setIsJoining(false)
  }
  const handleLeaveCircle = async (circleId: number | undefined | string) => {
    setIsLeaving(true)
    await leaveCircle(circleId)
    await queryClient.invalidateQueries({ queryKey: ["circle", id] })
    setIsLeaving(false)
  }
  return (
    <div className="px-8 py-10 max-w-7xl mx-auto">
      <div className="flex justify-between flex-wrap gap-6 items-start mb-10">
        <div className="flex gap-8 items-start">
          <img
            src={data?.image}
            alt="circle-logo"
            className="h-32 w-32 rounded-xl object-cover shadow-md"
          />
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl font-bold">{data?.name}</h1>
            <p className="text-muted-foreground text-base">{data?.description}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              {data?.members.length}{" "}
              {data?.members.length === 1 ? "member" : "members"}
            </div>
          </div>
        </div>
        {isJoined ?
          <Button className="shrink-0" disabled={isLeaving} variant={"destructive"} onClick={() => handleLeaveCircle(data?.id)}> {isLeaving ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              <LogOut />
              Leave
            </>
          )}</Button>
          :
          <Button className="shrink-0" disabled={isJoining} onClick={() => handleJoinCircle(data?.id)}> {isJoining ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            "Join Circle"
          )}</Button>
        }
      </div>

      <Separator className="mb-10" />

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-3 border-r pr-6">
          <h2 className="text-lg font-semibold mb-4">Members</h2>
          <div className="grid gap-4">
            {data?.members.map((member: memberType) => (
              <Link
                key={member.id}
                to={`/profile/${member.user.id}`}
                className="flex items-start gap-3 p-2 rounded-md hover:bg-muted transition"
              >
                <div className="rounded-full bg-muted h-9 w-9 flex items-center justify-center text-sm font-bold uppercase">
                  {member.user.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.user.name}</p>
                  <p className="text-xs text-muted-foreground">{member.user.email}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-9">
          <h2 className="text-lg font-semibold mb-6">Shared Items</h2>

          {data?.items.length === 0 ? (
            <p className="text-muted-foreground">No items shared yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {data?.items.map((circleItem: any) => (
                <div key={circleItem.id}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full bg-muted h-9 w-9 flex items-center justify-center text-sm font-bold uppercase">
                      {circleItem.user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{circleItem.user.name}</p>
                      <p className="text-xs text-muted-foreground">shared an item</p>
                    </div>
                  </div>

                  <Item item={circleItem.item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CirclePage;
