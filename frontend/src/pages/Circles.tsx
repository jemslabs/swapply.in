import Circle from "@/components/Circle";
import { Button } from "@/components/ui/button";
import { useApp } from "@/stores/useApp";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@clerk/clerk-react'
// Skeleton component inside the same file
const CircleSkeleton = () => (
  <div className="rounded-2xl shadow-sm animate-pulse border bg-muted p-6">
    <div className="flex items-center gap-5">
      <div className="h-24 w-24 rounded-xl border bg-[#1a1a1a]" />
      <div className="flex flex-col gap-2 max-w-md flex-grow">
        <div className="h-6 w-1/3 bg-[#1a1a1a] rounded" />
        <div className="h-4 w-2/3 bg-[#1a1a1a] rounded" />
        <div className="h-4 w-1/2 bg-[#1a1a1a] rounded mt-auto" />
      </div>
    </div>
  </div>
);

function Circles() {
  const { fetchMyCircles } = useApp();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["my-circles"],
    queryFn: async () => {

      const token = await getToken({ template: "default" });
      const res = await fetchMyCircles(token);
      return res;
    },
    staleTime: 20000,
  });

  if (isLoading) {
    // Show 4 skeletons while loading
    return (
      <div className="py-20 px-10 max-w-4xl mx-auto flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <CircleSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="py-5 px-10 max-w-4xl mx-auto min-h-screen">
      <div className="flex justify-between mb-5">
        <div className="flex items-center justify-center gap-5">


          <Button variant={"outline"} onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold text-white text-center tracking-tight">
            Circles          </h1>
        </div>
        <Button onClick={() => navigate("/circles/create")}>
          <Plus /> Create Circle
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {data && data.length > 0 ? (
          data.map((item, index) => <Circle key={index} circle={item.circle} />)
        ) : (
          <p className="text-center text-gray-500 mt-10">No circles found.</p>
        )}
      </div>
    </div>
  );
}

export default Circles;
