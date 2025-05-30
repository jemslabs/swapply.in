import type { circleType } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Users, Share2, ChevronRight, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const Circle = ({ circle }: { circle: circleType }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = async () => {
    const url = `${window.location.origin}/circles/${circle.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link!")
    }
  };
  return (
    <Card className="rounded-2xl shadow-sm">
      
      <CardContent className="px-6 flex items-center justify-between">
        <div className="flex items-start gap-5">
          <Avatar className="h-24 w-24 rounded-xl border">
            <AvatarImage src={circle?.image || undefined} />
          </Avatar>

          <div className="flex flex-col gap-2 max-w-md">
            <Link
              to={`/circles/${circle.id}`}
              className="group underline flex items-center gap-1"
            >
              <h2 className="text-xl font-semibold">{circle.name}</h2>
              {circle.isPrivate && ( 
                <span className="text-xs flex items-center rounded-full text-red-500">
                  <Lock className="h-3 w-3 mx-2" />
                </span>
              )}
              <ChevronRight className="text-gray-300 transition-all duration-200 group-hover:ml-2" />

            </Link>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {circle.description}
            </p>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{circle.members.length} members</span>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={shareLink}>
          <Share2 className="h-4 w-4 mr-2" />
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Circle;
