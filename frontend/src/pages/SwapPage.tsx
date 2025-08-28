import { useApp } from "@/stores/useApp";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, CalendarIcon, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import Item from "@/components/Item";
import Skill from "@/components/Skill";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/useAuth";
import { useState } from "react";
import type { scheduleMeetingType } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
function SwapPage() {
  const { getSwap, scheduleMeeting, confirmMeeting, completeSwap } = useApp();
  const { id } = useParams();
  const { user } = useAuth();
  const { getToken } = useClerkAuth();
  const [isScheduling, setIsScheduling] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [step, setStep] = useState(1);
  const queryClient = useQueryClient();
  const swapId = id ? parseInt(id) : undefined;

  const [meetingData, setMeetingData] = useState<scheduleMeetingType>({
    location: "",
    meetingLink: "",
    type: "INPERSON",
    swapId: swapId ?? 0,
    date: new Date(),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["swap", swapId],
    queryFn: async () => {
      const token = await getToken({ template: "default" });
      if (swapId) {
        const res = await getSwap(swapId, token);
        return res;
      }
      throw new Error("Swap ID missing");
    },
    staleTime: 12000,
    enabled: !!swapId,
  });

  if (isLoading)
    return (
      <div className="text-center p-4 text-muted-foreground">
        Loading swap details...
      </div>
    );
  if (error || !data)
    return (
      <div className="text-center p-4 text-red-500">Failed to load swap</div>
    );

  const swapStatus = data?.status;

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
      case "canceled":
        return "destructive";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };
  function convertISTToUTC(dateTimeLocal: string): Date {
    const [datePart, timePart] = dateTimeLocal.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    const istDate = new Date(
      Date.UTC(year, month - 1, day, hour - 5, minute - 30)
    );

    return istDate;
  }
  function formatToISTLocalString(date: Date): string {
    const istOffset = 5.5 * 60; // in minutes
    const localDate = new Date(date.getTime() + istOffset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
  }
  function formatPrettyIST(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };

    const formatted = new Intl.DateTimeFormat("en-IN", options).format(date);

    // Add ordinal suffix to day (e.g., 1st, 2nd, 3rd, 4th...)
    const day = date.toLocaleString("en-IN", {
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });
    const dayWithSuffix = addOrdinalSuffix(parseInt(day));

    return formatted.replace(/^\d+/, dayWithSuffix);
  }

  function addOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }

  const handleScheduleMeeting = async () => {
    setIsScheduling(true);
    const token = await getToken({ template: "default" });
    await scheduleMeeting(meetingData, token);
    queryClient.invalidateQueries({ queryKey: ["swap", id] });
    setIsScheduling(false);
  };
  const handleConfirmMeeting = async (id: number) => {
    setIsConfirming(true);
    const token = await getToken({ template: "default" });
    await confirmMeeting(id, token);
    queryClient.invalidateQueries({ queryKey: ["swap", id] });
    setIsConfirming(false);
  };
  const handleCompleteSwap = async (id: number) => {
    setIsCompleting(true);
    const token = await getToken({ template: "default" });
    await completeSwap(id, token);
    queryClient.invalidateQueries({ queryKey: ["swap", id] });
    setIsCompleting(false);
  };
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-10">

      {data.status === "COMPLETED" ? (
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-gradient-to-b from-green-700/30 to-green-900/20 border border-green-800 shadow-lg text-center space-y-5">
          <div className="flex justify-center text-6xl">🎉</div>

          <h3 className="text-2xl font-bold text-white">Swap Completed</h3>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            This swap has been marked as completed.
            Thank you for being part of the exchange!
          </p>

          <Badge
            variant="secondary"
            className="text-green-400 bg-green-900/40 border border-green-800 px-4 py-1 rounded-full"
          >
            COMPLETED
          </Badge>
        </div>
      ) : (
        <>

          {/* Stepper */}
          <div className="flex justify-between items-center gap-2">
            {["Swap Details", "Schedule Meet", "Mark Completed"].map(
              (label, index) => {
                const isActive = step === index + 1;
                const isDone = step > index + 1;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-xs sm:text-sm flex-1"
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition
                  ${isDone
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-violet-400 text-black"
                            : "bg-muted text-gray-400"
                        }`}
                    >
                      {isDone ? "✓" : index + 1}
                    </div>
                    <span className="mt-2 text-gray-300">{label}</span>
                  </div>
                );
              }
            )}
          </div>

          {/* Step 1: Swap Details */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-5 rounded-2xl border shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl shadow-sm w-full bg-background/60">
                  <img
                    src={data?.proposer?.image}
                    alt={data?.proposer?.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="text-sm">
                    <p className="text-gray-400">Proposed by</p>
                    <p className="font-medium">{data?.proposer?.name}</p>
                  </div>
                </div>
                {data?.proposerType === "ITEM" && <Item item={data?.proposerItem} isSwap={false} />}
                {data?.proposerType === "SKILL" && <Skill skill={data?.proposerSkill} isSwap={false} />}
              </div>

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="p-3 rounded-full bg-background/60 shadow-sm">
                  <RefreshCw className="h-6 w-6 text-gray-400" />
                </div>
                <Badge
                  variant={getStatusVariant(swapStatus)}
                  className="capitalize text-xs px-3 py-1"
                >
                  {swapStatus?.toLowerCase()}
                </Badge>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl shadow-sm w-full bg-background/60">
                  <img
                    src={data?.receiver?.image}
                    alt={data?.receiver?.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="text-sm">
                    <p className="text-gray-400">Received by</p>
                    <p className="font-medium">{data?.receiver?.name}</p>
                  </div>
                </div>
                {data?.receiverType === "ITEM" && <Item item={data?.receiverItem} isSwap={false} />}
                {data?.receiverType === "SKILL" && <Skill skill={data?.receiverSkill} isSwap={false} />}
              </div>
            </div>
          )}

          {step === 1 && swapStatus === "ACCEPTED" && (
            <div className="text-center">
              <Button onClick={() => setStep(2)}>Next: Schedule Meet</Button>
            </div>
          )}

          {/* Step 2: Meeting */}
          {step === 2 && (
            <>
              {data.meeting ? (
                <div className="w-full sm:w-[500px] mx-auto space-y-6 border border-border rounded-2xl p-6 shadow-lg bg-muted/30 text-left">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold">Meeting Scheduled</h3>
                    <p className="text-gray-400 text-sm">
                      Please review the meeting details below.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400">Type:</span>
                      <span className="text-sm">
                        {data.meeting.type === "ONLINE" ? "Online" : "In-Person"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400">Date:</span>
                      <span className="text-sm">{formatPrettyIST(new Date(data.meeting.date))}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400">Status:</span>
                      <Badge className={data.meeting.status === "CONFIRMED" ? "bg-green-500 font-medium" : "bg-yellow-500"}>
                        {data.meeting.status}
                      </Badge>
                    </div>

                    {data.meeting.type === "ONLINE" ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-400">Meeting Link:</span>
                        <a
                          href={data.meeting.meetingLink || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline text-sm break-words"
                        >
                          {data.meeting.meetingLink}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">Location:</span>
                        <span className="text-sm">{data.meeting.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end flex-wrap gap-3 pt-4">
                    {data.receiverId === user?.id &&
                      data.meeting?.status === "PENDING" && (
                        <Button onClick={() => handleConfirmMeeting(data.id)} disabled={isConfirming}>
                          {isConfirming ? (
                            <>
                              <Loader2 className="animate-spin mr-2" size={16} />
                              Confirming...
                            </>
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      )}

                    {data.meeting.status === "CONFIRMED" && (
                      <Button onClick={() => setStep(3)}>Next</Button>
                    )}

                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  </div>
                </div>
              ) : user?.id === data.proposerId ? (
                <div className="flex flex-col gap-4 bg-muted/30 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-semibold text-center">Schedule a Meetup</h3>

                  {/* Meeting Type */}
                  <div className="space-y-2">
                    <Label className="text-sm">Meeting Type</Label>
                    <RadioGroup
                      value={meetingData.type}
                      onValueChange={(value) =>
                        setMeetingData((prev) => ({ ...prev, type: value as "INPERSON" | "ONLINE" }))
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="INPERSON" id="inperson" />
                        <Label htmlFor="inperson">In-Person</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ONLINE" id="online" />
                        <Label htmlFor="online">Online</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label htmlFor="meetingDate">Meeting Date</Label>
                    <div className="relative">
                      <Input
                        id="meetingDate"
                        type="datetime-local"
                        value={formatToISTLocalString(meetingData.date)}
                        onChange={(e) =>
                          setMeetingData((prev) => ({ ...prev, date: convertISTToUTC(e.target.value) }))
                        }
                        className="pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:z-10"
                      />
                      <button
                        type="button"
                        onClick={() => (document.getElementById("meetingDate") as HTMLInputElement | null)?.showPicker?.()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
                      >
                        <CalendarIcon className="text-white" size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-300">{formatPrettyIST(meetingData.date)}</p>
                  </div>

                  {/* Online vs Location */}
                  {meetingData.type === "ONLINE" ? (
                    <div className="space-y-2">
                      <Label htmlFor="meetingLink">Meeting Link</Label>
                      <Input
                        id="meetingLink"
                        placeholder="Meeting link"
                        value={meetingData.meetingLink}
                        onChange={(e) => setMeetingData((prev) => ({ ...prev, meetingLink: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Meeting location"
                        value={meetingData.location}
                        onChange={(e) => setMeetingData((prev) => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="flex justify-center gap-3 pt-4">
                    <Button onClick={handleScheduleMeeting} disabled={isScheduling}>
                      {isScheduling ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        "Schedule"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white text-lg sm:text-xl bg-muted/30 p-10 border rounded-2xl">
                  Waiting for proposer to schedule the meeting.
                  <div className="flex justify-center gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 3: Finalize Swap */}
          {step === 3 && (
            <div className="max-w-md mx-auto space-y-6 text-center border border-border rounded-2xl p-6 shadow-sm bg-muted/30">
              <h3 className="text-2xl font-bold">Finalize the Swap</h3>

              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {user?.id === data.proposerId
                  ? "If the swap is successfully completed in person, click below to mark it as completed."
                  : "Only the proposer can finalize the swap once it's completed."}
              </p>

              <div className="flex justify-center gap-4 pt-2 flex-wrap">
                {user?.id === data.proposerId && (
                  <Button
                    className="px-6 py-2"
                    onClick={() => handleCompleteSwap(data.id)}
                    disabled={isCompleting}
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Completing...
                      </>
                    ) : (
                      "Mark as Completed"
                    )}
                  </Button>
                )}

                <Button variant="outline" onClick={() => setStep(2)} className="px-6 py-2">
                  Back
                </Button>
              </div>
            </div>
          )}

        </>
      )}
    </div>


  );
}

export default SwapPage;
