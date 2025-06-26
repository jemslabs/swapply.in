import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Item from "@/components/Item";
import ItemSkeleton from "@/components/ItemSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { categories } from "@/lib/utils";
import { useApp } from "@/stores/useApp";
import { Loader2, Search } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

function BrowseItems() {
  const { getBrowseItems } = useApp();
  const { getToken } = useAuth();
  const [filter, setFilter] = useState({
    category: "ELECTRONICS",
    query: "",
    fromPrice: 0,
    toPrice: 10000,
    score: 100,
    condition: "NEW",
  });

  const {
    data,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["browse-items"],
    queryFn: async () => {

      const token = await getToken({ template: "default" })
      const res = await getBrowseItems(filter, token);
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });

  const items = data?.items ?? [];

  const handleApply = () => {
    refetch();
  };

  return (
    <div className="py-6 px-5 min-h-screen">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="relative w-full">
          <Input
            placeholder="Search for items"
            className="pr-10"
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            value={filter.query}
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 w-full">
          <div className="flex gap-3 flex-wrap">
            <Select
              value={filter.category}
              onValueChange={(value) =>
                setFilter({ ...filter, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {categories.map((category, index) => (
                    <SelectItem value={category.value} key={index}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={filter.condition}
              onValueChange={(value) =>
                setFilter({ ...filter, condition: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Condition</SelectLabel>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="LIKE_NEW">Like New</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                  <SelectItem value="DAMAGED">Damaged</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 grow">
            <label className="text-sm font-medium">
              Price Range: {filter.fromPrice} - {filter.toPrice}
            </label>
            <Slider
              min={0}
              max={50000}
              step={100}
              value={[filter.fromPrice, filter.toPrice]}
              onValueChange={([from, to]) =>
                setFilter({ ...filter, fromPrice: from, toPrice: to })
              }
            />
          </div>

          <div className="flex flex-col gap-2 w-48">
            <label className="text-sm font-medium">
              Score: 0 - {filter.score}
            </label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[filter.score]}
              onValueChange={([score]) =>
                setFilter({ ...filter, score })
              }
            />
          </div>

          <div className="flex justify-end">
            <Button disabled={isFetching} onClick={handleApply}>
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                "Search & Filter"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto">
        {isLoading || isFetching
          ? Array.from({ length: 8 }).map((_, idx) => (
            <ItemSkeleton key={idx} />
          ))
          : items && items?.length > 0 ? (
            items?.map((item) => <Item key={item.id} item={item} isBoost={false} />)
          ) : (
            <div className="col-span-full text-center text-muted-foreground text-sm">
              No items found for this filter.
            </div>
          )}
      </div>
    </div>
  );
}

export default BrowseItems;
