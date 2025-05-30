import Item from "@/components/Item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import type { ItemType } from "@/lib/types";
import { useAuth } from "@/stores/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const { fetchPublicUser, user } = useAuth();

  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetchPublicUser(id);
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">
      <Card className="flex flex-row items-center p-6 bg-background">
        <Avatar className="w-20 h-20">
          <AvatarFallback className="text-2xl">
            {data?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-semibold">
              {data?.name}
            </CardTitle>
            {user && user?.id === data?.id && (
              <Badge
                variant={"outline"}
                className="cursor-pointer border-dashed border-white"
              >
                Get Verified
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">{data?.email}</p>
        </div>
      </Card>

      <h1 className="text-2xl sm:text-2xl font-bold tracking-tight flex items-center gap-4 mb-5">
        Items Listed ( {data?.items?.length} )
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
        {data?.items?.map((item: ItemType, index) => (
          <Item item={item} key={index} isBoost={false} />
        ))}
      </div>
    </div>
  );
}

export default Profile;
