import Item from "@/components/Item";
import { useApp } from "@/stores/useApp";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn, ISTtoUTC } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

function SwapPage() {
  const { getSwap, scheduleSwapMeeting, cancelSwapMeeting } = useApp();
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["swap", id],
    queryFn: async () => await getSwap(id),
    staleTime: 12000,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const [meetingLocation, setMeetingLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState(""); // e.g. "2:30 PM"
  const [notes, setNotes] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false)
  const existingMeeting = data?.swapInperson;

  useEffect(() => {
    if (existingMeeting) {
      setMeetingLocation(existingMeeting.meetingLocation || "");
      setNotes(existingMeeting.notes || "");
      if (existingMeeting.date) setDate(new Date(existingMeeting.date));
      if (existingMeeting.time) setTime(existingMeeting.time);
    }
  }, [existingMeeting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !date || !time) return;
    const utcDateString = ISTtoUTC({ time, date });
    setIsSending(true);
    await scheduleSwapMeeting({
      date: utcDateString,
      time,
      meetingLocation,
      notes,
      swapProposalId: parseInt(id),
    });
    await queryClient.invalidateQueries({ queryKey: ["swap", id] });
    setIsSending(false);
  };
  const handleCancelMeeting = async (id: string | number | undefined) => {
    setIsCanceling(true);
    await cancelSwapMeeting(id);
    await queryClient.invalidateQueries({ queryKey: ["swap", id] });
    setIsCanceling(false)
  }

  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  if (isLoading) return <div className="text-center p-4 text-gray-500">Loading swap details...</div>;
  if (error || !data) return <div className="text-center p-4 text-red-500">Failed to load swap</div>;

  const swapStatus = data?.status;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl sm:text-2xl font-bold tracking-tight flex items-center gap-4 mx-10 mb-5">
        <Button variant={"outline"} onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        Swap Details
      </h1>

      <div className="flex justify-between items-center gap-6 p-4 rounded-2xl shadow-md">
        <div className="w-1/2">
          <Item item={data?.proposedItem} isBoost={false}/>
        </div>
        <div className="flex flex-col items-center">
          <RefreshCw className="text-muted-foreground h-6 w-6" />
          <Badge className="mt-2" variant={"secondary"}>
            {capitalizeFirstLetter(swapStatus)}
          </Badge>
        </div>
        <div className="w-1/2">
          <Item item={data?.receiverItem} isBoost={false}/>
        </div>
      </div>

      {existingMeeting && (
        <div className="p-4 border bg-muted rounded-lg mb-6 space-y-2">
          <h4 className="font-semibold">
            Current Meeting Status:
            <Badge className="ml-2">
              {capitalizeFirstLetter(existingMeeting.meetingStatus)}
            </Badge>
          </h4>
          {existingMeeting.meetingStatus !== "CANCELLED" ? (
            <ul className="text-sm text-green-300 list-disc list-inside space-y-1">
              <li><strong>Date:</strong> {format(new Date(existingMeeting.date), "PPP")}</li>
              <li><strong>Time:</strong> {existingMeeting.time}</li>
              <li><strong>Location:</strong> {existingMeeting.meetingLocation}</li>
              {existingMeeting.notes && <li><strong>Notes:</strong> {existingMeeting.notes}</li>}
            </ul>
          ) : (
            <p className="text-sm text-red-600">This meeting has been cancelled. You can schedule a new one below.</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-2xl shadow-md">
        <h3 className="text-xl font-medium mb-4">
          {existingMeeting ? "Update Meeting Details" : "Schedule a New Meeting"}
        </h3>

        <div className="space-y-2">
          <Label htmlFor="location">Meeting Location</Label>
          <Input
            id="location"
            placeholder="e.g. Central Park, coffee shop on Main St"
            value={meetingLocation}
            onChange={(e) => setMeetingLocation(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Time</Label>
          <Input
            type="text"
            placeholder="e.g. 2:30 PM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            pattern="^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$"
            title="Time must be in 12-hour format (e.g. 2:30 PM)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any extra info like look for a blue backpack"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" className="flex-1" disabled={isSending}>
            {isSending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {existingMeeting ? "Updating..." : "Scheduling..."}
              </div>
            ) : (
              <div>{existingMeeting ? "Update Meeting Details" : "Schedule Meeting"}</div>
            )}
          </Button>

          {existingMeeting && existingMeeting.meetingStatus !== "CANCELLED" && (
            <Button
              className="flex-1"
              variant="destructive"
              type="button"
              onClick={() => handleCancelMeeting(existingMeeting?.id)}
              disabled={isCanceling}
            >
              {isCanceling ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </div>
              ) : (
                "Cancel Meeting"
              )}
            </Button>
          )}
        </div>

      </form>

    </div>
  );
}

export default SwapPage;
