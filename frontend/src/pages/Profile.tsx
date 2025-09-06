import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/stores/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { CalendarDays, Copy } from "lucide-react";
import Item from "@/components/Item";
import Skill from "@/components/Skill";
import ItemSkeleton from "@/components/ItemSkeleton";
import TopSwapperBadge from "@/components/TopSwapperBadge";
import type { BadgeType } from "@/lib/types";
import type { JSX } from "react";

function Profile() {
  const { id } = useParams();
  const { fetchPublicUser, user } = useAuth();
  const { getToken } = useClerkAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const token = await getToken({ template: "default" });
      return await fetchPublicUser(id, token);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="max-w-6xl mx-auto min-h-screen px-4 py-5">
      <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 md:p-8 shadow-xl bg-[#2a202d]/70 backdrop-blur-md border border-white/10 rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          {isLoading ? (
            <Skeleton className="w-24 h-24 rounded-full bg-zinc-600" />
          ) : (
            <Avatar className="w-24 h-24 shadow-lg ring-2 ring-white/10">
              <AvatarImage src={data?.image} alt={data?.name} />
              <AvatarFallback className="text-3xl">{data?.name?.[0]}</AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className="flex-1 flex flex-col space-y-2 text-center md:text-left">
          <div
            className={`flex flex-wrap items-center justify-center md:justify-start gap-2 ${data && data?.badges?.length > 0 ? "flex-col md:flex-row" : ""
              }`}
          >
            {isLoading ? (
              <Skeleton className="h-6 w-40 rounded-md" />
            ) : (
              <>
                <CardTitle className="text-3xl font-semibold tracking-tight text-white">
                  {data?.name}
                </CardTitle>

                {data && data?.badges?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.badges.map((badge: BadgeType, i: number) => {
                      const badgeComponents: Record<string, JSX.Element> = {
                        TOP_SWAPPER: <TopSwapperBadge key={i} />,
                        // Add other badge types here
                      };
                      return badgeComponents[badge.type] || null;
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            {isLoading ? (
              <Skeleton className="h-4 w-48 rounded-md" />
            ) : (
              <>
                <p className="text-muted-foreground text-sm">{data?.email}</p>
                <button
                  onClick={() => {
                    if (!data?.email) return;
                    navigator.clipboard.writeText(data.email);
                    toast("Email copied!");
                  }}
                  className="text-muted-foreground hover:text-white transition"
                  aria-label="Copy Email"
                >
                  <Copy className="w-4 h-4 cursor-pointer" />
                </button>
              </>
            )}
          </div>

          {isLoading ? (
            <Skeleton className="h-4 w-60 rounded-md" />
          ) : data?.createdAt ? (
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mt-1">
              <CalendarDays className="w-4 h-4 opacity-70" />
              <span>
                Member since{" "}
                <span className="font-medium text-white">
                  {new Date(data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>
          ) : null}
        </div>

      </Card>


      <Tabs defaultValue="items" className="mt-10 w-full">
        <TabsList className="bg-[#1c1c24] mb-6 sm:w-[300px] w-full rounded-xl flex justify-center">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          {isLoading ? (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ItemSkeleton key={i} />
              ))}
            </div>
          ) : data?.items?.length ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
              {data.items.map((item) => (
                <Item
                  item={item}
                  isSwap={user?.id !== Number(id)}
                  key={item.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              No items listed yet.
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills">
          {isLoading ? (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ItemSkeleton key={i} />
              ))}
            </div>
          ) : data?.skills?.length ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
              {data.skills.map((skill) => (
                <Skill
                  skill={skill}
                  isSwap={user?.id !== Number(id)}
                  key={skill.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              No skills offered yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;
