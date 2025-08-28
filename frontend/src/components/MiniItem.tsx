import type { ItemType } from "@/lib/types";
import { Link } from "react-router-dom";

function MiniItem({ item }: { item: ItemType }) {
  return (
    <Link className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border w-fit hover:border-[#c084fc]" to={`/item/${item.id}`}>
      <img
        src={item.image}
        alt={item.title}
        className="w-10 h-10 rounded object-cover"
      />
      <div className="text-white text-sm">
        <p className="font-medium line-clamp-1">{item.title}</p>
        <p className="text-white/60 text-xs">₹{item.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
export default MiniItem;