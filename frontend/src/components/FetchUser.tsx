import { useAuth } from "@/stores/useAuth"
import { useQuery } from "@tanstack/react-query";


function FetchUser() {
    const { fetchUser } = useAuth();
    useQuery({
        queryKey: ["logged-user"],
        queryFn: async () => {
            await fetchUser();
            return true;
        },
        staleTime: 12000,
        retry: 1
    })

    return null;
}

export default FetchUser