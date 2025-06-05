import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@/stores/useApp";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, RefreshCw, Loader2, ArrowLeft, Rocket, BadgeCheck } from "lucide-react";
import { categories, conditions } from "@/lib/utils";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/stores/useAuth";
import ScoreBadge from "@/components/ScoreBadge";

function Item() {
  const { id } = useParams();
  const { getItem, addItemCircle } = useApp();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedCircleId, setSelectedCircleId] = useState<string | null | number>(null);
  const { user: loggedUser } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await getItem(id);
      return res;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  if (isLoading) {
    return <p className="text-center mt-10 text-gray-500">Loading item...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-center mt-10 text-red-500">Failed to load item.</p>
    );
  }

  const {
    id: itemId,
    title,
    description,
    image,
    currentPrice,
    originalPrice,
    currencyType,
    company,
    category,
    condition,
    hasBill,
    createdAt,
    user,
    isSwapped,
    score, itemAge,
    boostedItem
  } = data;
  const hasDiscount =
    originalPrice &&
    originalPrice !== currentPrice &&
    originalPrice > currentPrice;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const isBoosted = boostedItem?.itemId === itemId;
  const isPro = !!user?.plan;
  const handleItemInCircle = async (circleId: string | number) => {
    const addItemdata = { circleId: circleId, itemId: data?.id };
    setIsSending(true)
    await addItemCircle(addItemdata);
    setIsSending(false)
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="gap-6">
        <Button variant={"outline"} onClick={() => navigate(-1)} className="my-3">
          <ArrowLeft />
          Go Back
        </Button>
        <Card className={`flex md:flex-row flex-1 px-5 relative ${isBoosted && 'border-[#c084fc] border-2'}`}>
          <div className="md:w-1/2">
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full rounded-l-xl max-h-[400px]"
            />

          </div>
          {isBoosted && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-[#c084fc] text-black text-xs px-2 py-1 shadow-md rounded-full flex items-center gap-1">
                <Rocket className="h-3 w-3" />
                Boosted
              </Badge>
            </div>
          )}
          <div className="absolute top-4 right-4 z-10">
            <ScoreBadge score={score ?? 0} />
          </div>
          <CardContent className="p-6 md:w-1/2 space-y-4 ">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
                <p className="text-sm text-muted-foreground">
                  Listed on {new Date(createdAt).toLocaleDateString()}
                </p>

              </div>
            </div>

            <div className="text-md">
              {description.length > 160 && !showFullDesc
                ? description.slice(0, 160) + "..."
                : description}
              {description.length > 160 && (
                <button
                  className="text-blue-600 ml-2 text-sm underline cursor-pointer"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? "read less" : "read more"}
                </button>
              )}
            </div>
            <Separator />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Company:</span> {company}
              </div>
              <div>
                <span className="font-semibold">Category:</span>{" "}
                {categories.find((itemCategory) => itemCategory.value === category)?.name || category}
              </div>
              <div>
                <span className="font-semibold">Condition:</span>{" "}
                <Badge variant="secondary">
                  {conditions.find((itemCondition) => itemCondition.value === condition)?.name || condition}
                </Badge>
              </div>
              <div>
                <span className="font-semibold">Has Bill:</span>{" "}
                {hasBill ? "Yes" : "No"}
              </div>
              <div className="whitespace-nowrap">
                <span className="font-semibold mr-2">Product Age:</span>
                {itemAge} {itemAge > 1 ? "Months" : "Month"}
              </div>
            </div>


            <div className="pt-4">
              <span className="text-muted-foreground text-sm">Swap Value</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-white">
                  {currencyType} {currentPrice ? currentPrice.toLocaleString() : ""}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-sm line-through text-gray-500">
                      {currencyType} {originalPrice ? originalPrice.toLocaleString() : ""}
                    </span>

                    <Badge
                      variant="outline"
                      className="text-xs text-green-600 border-green-500"
                    >
                      Save {discountPercent}%
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {isSwapped ? (
              <Button className="w-full" disabled variant="outline">
                Swapped
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to={`/item/${id}/swap`} className="w-full">
                  <Button className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Propose a Swap
                  </Button>
                </Link>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add to Circle
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    {loggedUser?.circles && loggedUser?.circles.length > 0 ? (
                      <div className="space-y-2">
                        {loggedUser.circles.map((c) => {
                          const isSelected = selectedCircleId === c.circle.id;
                          return (
                            <Button
                              key={c.circle.id}
                              variant={isSelected ? "default" : "ghost"}
                              className="w-full justify-start"
                              onClick={() =>
                                setSelectedCircleId((prev) =>
                                  prev === c.circle.id ? null : c.circle.id
                                )
                              }
                            >
                              <Avatar className="h-5 w-5 mr-2">
                                <AvatarImage src={c.circle.image} />
                                <AvatarFallback>{c.circle.name?.charAt(0)}</AvatarFallback>

                              </Avatar>
                              {c.circle.name}
                            </Button>
                          );
                        })}
                        {selectedCircleId && (
                          <Button
                            className="w-full mt-2"
                            variant={"outline"}
                            onClick={async () => {
                              if (selectedCircleId) {
                                await handleItemInCircle(selectedCircleId)
                              }
                            }}
                            disabled={isSending}
                          >
                            {isSending ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : (
                              "Send"
                            )}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        You haven&apos;t joined any circles yet.
                      </p>
                    )}
                  </PopoverContent>
                </Popover>

              </div>
            )}
          </CardContent>
        </Card>

        <div className="w-full md:w-1/3 mt-5">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Listed by</h2>
              <CardTitle className="flex items-center gap-3 mt-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback>
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Link to={`/profile/${user?.id}`}>
                  <p className="text-lg font-medium flex items-center gap-2 underline">
                    {user?.name || "Unknown Seller"}
                    {isPro &&
                    <div className="gap-1 rounded-full text-blue-400 text-xs font-medium shadow-sm">
                      <BadgeCheck className="fill-blue-400 text-white" size={18}/>
                    </div>
                  }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || "No email provided"}
                  </p>
                  
                </Link>
                
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Item;
