import { useAuth } from "@/stores/useAuth"
import { useQuery } from "@tanstack/react-query";


function FetchUser() {
  const { fetchUser, user } = useAuth();

  useQuery({
    queryKey: ["logged-user"],
    queryFn: async () => {
      try {
        await fetchUser();
        return true;
      } catch (error) {
        return false;
      }
    },
    enabled: !user,
    staleTime: 12000,
    retry: false, // disable retries to avoid multiple 401 calls
  });

  return null;
}


export default FetchUser