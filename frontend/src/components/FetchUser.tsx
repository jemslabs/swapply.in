import { useAuth } from "@/stores/useAuth";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

function FetchUser() {
  const { fetchUser, user } = useAuth();
  const { getToken } = useClerkAuth();

  useQuery({
    queryKey: ["logged-user"],
    queryFn: async () => {
      const token = await getToken({ template: "default" });

      if (!token) throw new Error("Token missing");
      await fetchUser(token);
      return true;
    },
    enabled: !user,
    staleTime: 12000,
    retry: false,
  });

  return null;
}

export default FetchUser;
