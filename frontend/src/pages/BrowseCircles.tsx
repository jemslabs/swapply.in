import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useApp } from "@/stores/useApp";
import { Search } from "lucide-react";
import Circle from "@/components/Circle";

function BrowseCircles() {
  const { getBrowseCircles } = useApp();
  const [filter, setFilter] = useState({ query: "" });
  const [debouncedQuery, setDebouncedQuery] = useState(filter.query);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(filter.query);
    }, 500);

    return () => clearTimeout(timer);
  }, [filter.query]);

  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["browse-circles", debouncedQuery],
    queryFn: async () => {
      const res = await getBrowseCircles({ query: debouncedQuery });
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });

  const circles = data ?? [];

  return (
    <div className="py-6 px-5">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="relative w-full">
          <Input
            placeholder="Search for circles"
            className="pr-10"
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            value={filter.query}
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-10 max-w-6xl mx-auto">
        {isLoading || isFetching ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx}>

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
            </div>
          ))
        ) : circles.length > 0 ? (
          circles.map((circle) => (
            <Circle key={circle.id} circle={circle} />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground text-sm">
            No circles found for this query.
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseCircles;
