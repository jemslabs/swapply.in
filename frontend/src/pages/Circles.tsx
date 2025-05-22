import Circle from "@/components/Circle";
import { Button } from "@/components/ui/button";
import { useApp } from "@/stores/useApp"
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Circles() {
  const { fetchMyCircles } = useApp();
  const navigate = useNavigate()
  const { data } = useQuery({
    queryKey: ["my-circles"],
    queryFn: async () => {
      const res = await fetchMyCircles();
      return res;
    },
    staleTime: 20000,
  });
  return (
    <div className="py-5 px-10">
      <div className="flex justify-end mb-5">
        <Button onClick={()=>navigate("/circles/create")}><Plus />  Create Circle </Button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {data && data.length > 0 ? (
          data.map((data, index) => (
            <Circle key={index} circle={data.circle} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No circles found.</p>
        )}
      </div>


    </div>

  )
}

export default Circles