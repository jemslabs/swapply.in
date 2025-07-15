
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/stores/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth as useClerkAuth } from '@clerk/clerk-react'
function Profile() {
  const { id } = useParams();
  const { fetchPublicUser } = useAuth();
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
          </div>

          <p className="text-muted-foreground text-base">{data?.email}</p>
        </div>
      </Card>

    </div>
  );
}

export default Profile;
