import { useEffect, useState } from "react";
import Item from "@/components/Item";
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
import type { ItemType } from "@/lib/types";
import { categories } from "@/lib/utils";
import { useApp } from "@/stores/useApp";
import { Loader2, Search } from "lucide-react";

function Browse() {
  const { getBrowseItems } = useApp();

  const [filter, setFilter] = useState({
    category: "ELECTRONICS",
    query: "",
    fromPrice: 0,
    toPrice: 10000,
    currencyType: "INR",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);

  const fetchItems = async (filters: typeof filter) => {
    setIsLoading(true);
    const res = await getBrowseItems(filters);
    setItems(res.items);
    setIsLoading(false);
  };


  useEffect(() => {
    fetchItems(filter);
  }, []);

  const handleApply = () => {
    fetchItems(filter);
  };

  return (
    <div className="py-6 px-5">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="relative w-full">
          <Input
            placeholder="Search for items"
            className="pr-10"
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            value={filter.query}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 w-full">
          <div className="flex gap-3">
            <Select
              value={filter.category}
              onValueChange={(value) => setFilter({ ...filter, category: value })}
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
              value={filter.currencyType}
              onValueChange={(value) => setFilter({ ...filter, currencyType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currency</SelectLabel>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 grow">
            <label className="text-sm font-medium">
              Price Range: {filter.fromPrice} - {filter.toPrice} {filter.currencyType}
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

          <div className="flex justify-end">
            <Button disabled={isLoading} onClick={handleApply}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                "Apply Filters"
              )}
            </Button>
          </div>
        </div>
      </div>

      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto">
          {items.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-12 text-sm">
          {isLoading ? "Loading items..." : "No items found for this filter."}
        </div>
      )}
    </div>
  );
}

export default Browse;
