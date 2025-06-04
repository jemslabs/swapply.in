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
    queryFn: async () => await fetchPublicUser(id),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12">

      <Card className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 shadow-lg">
        <Avatar className="w-24 h-24">
          <AvatarFallback className="text-3xl">
            {data?.name?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {data?.name}
            </CardTitle>
            {user?.id === data?.id && (
              <Badge
                variant="outline"
                className="border-dashed border-muted-foreground text-muted-foreground hover:border-primary transition"
              >
                Get Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-base">{data?.email}</p>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Listed Items ({data?.items?.length || 0})
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.items?.map((item: ItemType, index) => (
          <Item item={item} key={index} isBoost={false} />
        ))}
      </div>
    </div>
  );
}

export default Profile;
