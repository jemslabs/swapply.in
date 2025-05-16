import Item from "@/components/Item";
import type { ItemType } from "@/lib/types";
import { useApp } from "@/stores/useApp";

import { useQuery } from "@tanstack/react-query";

function MyItems() {
  const { getMyItems } = useApp();

  const { data, isLoading, isError } = useQuery<ItemType[]>({
    queryKey: ["my-items"],
    queryFn: async () => {
      const res = await getMyItems();
      return res;
    },
    staleTime: 12000,
  });

  return (
    <div>


      {isLoading ? (
        <p className="text-center text-gray-500 mt-10">Loading your items...</p>
      ) : isError ? (
        <p className="text-center text-red-500 mt-10">Failed to load items.</p>
      ) : data && data.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">You haven't listed any items yet.</p>
      ) : (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight m-8">
            Your Listed Items
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 mx-10">
            {data?.map((item: ItemType, index) => (
              <Item item={item} key={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyItems;
