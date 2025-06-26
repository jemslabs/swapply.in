import { useState } from "react";
import Item from "@/components/Item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import type { ItemType } from "@/lib/types";
import { useAuth } from "@/stores/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import Circle from "@/components/Circle";
import { useAuth as useClerkAuth } from '@clerk/clerk-react'
function Profile() {
  const { id } = useParams();
  const { fetchPublicUser, user } = useAuth();
  const navigate = useNavigate();
  const { getToken } = useClerkAuth();
  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const token = await getToken({ template: "default" });

      return await fetchPublicUser(id, token);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });


  const isPro = !!data?.plan;
  const [activeTab, setActiveTab] = useState<"items" | "circles">("items");

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-6 min-h-screen">
      <Card className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 shadow-lg">
        <Avatar className="w-24 h-24">
          <AvatarImage src={data?.image} alt={data?.name} />
          <AvatarFallback className="text-3xl">
            {data?.name?.[0]}
          </AvatarFallback>
        </Avatar>


        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {data?.name}
            </CardTitle>
            {isPro && (
              <div className="gap-1 rounded-full text-blue-400 text-xs font-medium shadow-sm">
                <BadgeCheck className="fill-blue-400 text-white" />
              </div>
            )}

            {user?.id === data?.id && !isPro && (
              <Badge
                variant="outline"
                className="border-dashed border-primary transition text-xs cursor-pointer"
                onClick={() => navigate("/pricing")}
              >
                Get Verified
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-base">{data?.email}</p>
        </div>
      </Card>

      <div className="flex border-b border-muted">
        <button
          className={`px-4 py-2 font-semibold cursor-pointer ${activeTab === "items"
            ? "border-b-2 border-purple-500 text-white"
            : "text-gray-500 hover:text-gray-300"
            }`}
          onClick={() => setActiveTab("items")}
        >
          Listed Items
        </button>
        <button
          className={`px-4 py-2 font-semibold cursor-pointer ${activeTab === "circles"
            ? "border-b-2 border-purple-500 text-white"
            : "text-gray-500 hover:text-gray-300"
            }`}
          onClick={() => setActiveTab("circles")}
        >
          Circles
        </button>
      </div>

      {activeTab === "items" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.items?.map((item: ItemType, index) => (
            <Item item={item} key={index} isBoost={false} />
          ))}
        </div>
      )}

      {activeTab === "circles" && (
        <div className="grid grid-cols-1 gap-6">
          {data?.circles &&
            data?.circles?.map((circle, index) => (
              <div key={index}>
                <Circle circle={circle.circle} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
