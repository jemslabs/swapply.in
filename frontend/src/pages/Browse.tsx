import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/stores/useApp";
import { Search } from "lucide-react";
import { useState } from "react";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/lib/useDebounce";
import Item from "@/components/Item";
import type { ItemType, SkillType } from "@/lib/types";
import Skill from "@/components/Skill";
import ItemSkeleton from "@/components/ItemSkeleton";

function Browse() {
  const { getBrowseAll, getBrowseItems, getBrowseSkills } = useApp();

  const [tab, setTab] = useState<"all" | "items" | "skills">("all");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { getToken } = useClerkAuth();

  const {
    data: allResults = [],
    isLoading: isLoadingAll,
  } = useQuery({
    queryKey: ["browse", "all", debouncedQuery],
    queryFn: async () => {
      const token = await getToken({ template: "default"});
      const res = await getBrowseAll({ query: debouncedQuery }, token);
      return res.results;
    },
    enabled: tab === "all",
  });

  const {
    data: itemResults = [],
    isLoading: isLoadingItems,
  } = useQuery({
    queryKey: ["browse", "items", debouncedQuery],
    queryFn: async () => {
      const token = await getToken({ template: "default"});
      const res = await getBrowseItems({ query: debouncedQuery }, token);
      return res.items;
    },
    enabled: tab === "items",
  });

  const {
    data: skillResults = [],
    isLoading: isLoadingSkills,
  } = useQuery({
    queryKey: ["browse", "skills", debouncedQuery],
    queryFn: async () => {
      const token = await getToken({ template: "default"});
      const res = await getBrowseSkills({ query: debouncedQuery }, token);
      return res.skills;
    },
    enabled: tab === "skills",
  });


  return (
    <div className="p-5 bg-background">
      <div className="flex flex-col gap-6">
        <div className="w-full sm:w-1/2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search items and skills..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Tabs value={tab} onValueChange={(val) => setTab(val as any)} className="w-full">
          <TabsList className="w-full sm:w-[300px] bg-[#2a202d]/70">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-4">
            {isLoadingAll ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {allResults.map((r, i) =>
                  r.type === "item" ? (
                    <Item item={r} key={i} isSwap={true}/>
                  ) : (
                    <Skill skill={r} key={i} isSwap={true}/>
                  )
                )}
              </div>
            )}

          </TabsContent>

          <TabsContent value="items" className="pt-4">
            {isLoadingItems ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {itemResults.map((r) => (
                  <Item key={r.id} item={r as ItemType} isSwap={true}/>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills" className="pt-4">
            {isLoadingSkills ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {skillResults.map((r) => (
                  <Skill key={r.id} skill={r as SkillType} isSwap={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Browse;
