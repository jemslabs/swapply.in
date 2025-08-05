import Item from "@/components/Item";
import Skill from "@/components/Skill";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/stores/useAuth"
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto min-h-screen px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
      </div>
      <Tabs defaultValue="items" className="mt-10 w-full">
        <TabsList className="bg-[#1c1c24] mb-6 sm:w-[300px] w-full rounded-xl flex justify-center">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          {user?.items?.length ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
              {user.items.map((item) => (
                <Item
                  item={item}
                  isSwap={false}
                  key={item.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              No items listed yet.
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills">
          {user?.skills?.length ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
              {user.skills.map((skill) => (
                <Skill
                  skill={skill}
                  isSwap={false}
                  key={skill.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              No skills offered yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MyListings 