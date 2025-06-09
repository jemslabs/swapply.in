import Item from "@/components/Item";
import { Button } from "@/components/ui/button";
import type { ItemType } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/stores/useAuth";

function MyItems() {
  const navigate = useNavigate();
  const {user } = useAuth();


  return (
    <div className="mx-10 py-5">


      {user?.items && user.items.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">You haven't listed any items yet.</p>
      ) : (
        <div>
          <h1 className="text-2xl sm:text-2xl font-bold tracking-tight flex items-center gap-4 mx-10 mb-10">
            <Button variant={"outline"} onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            Your Listed Items
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5 mx-10">
            {user?.items?.map((item: ItemType, index) => (
              <Item item={item} key={index} isBoost={true}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyItems;
