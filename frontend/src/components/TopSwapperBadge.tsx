import { Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function TopSwapperBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex flex-col items-center cursor-pointer">
            <div
              className="w-8 h-8
                         bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600
                         rounded-b-[60%] rounded-t-sm
                         border border-yellow-700/60
                         shadow-md
                         flex items-center justify-center"
            >
              <Crown className="w-4 h-4 text-amber-900 drop-shadow-sm" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Top Swapper
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TopSwapperBadge;
