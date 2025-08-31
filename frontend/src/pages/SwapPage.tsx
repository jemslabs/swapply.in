import { useApp } from "@/stores/useApp";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RefreshCw,
  CalendarIcon,
  Loader2,
  ChevronRight,
  Check,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import MiniItem from "@/components/MiniItem";
import MiniSkill from "@/components/MiniSkill";

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
  const navigate = useNavigate();
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-purple-400" />
      </div>
    );
  }
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8">
      {data.status === "COMPLETED" ? (
        <>
          <div className="max-w-6xl mx-auto p-6 sm:p-10 rounded-2xl bg-[#c084fc]/20 border border-purple-500/30 text-center text-white space-y-8 sm:space-y-10">
          
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl sm:text-6xl">🎉</div>
              <h3 className="text-2xl sm:text-3xl font-bold">Swap Completed</h3>
              <p className="text-purple-200 text-sm sm:text-base max-w-md">
                Your swap was successfully completed! Here&apos;s what was exchanged between both parties:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-center">
              <div className="flex flex-col items-center gap-3">
                {data?.proposerType === "ITEM" && <MiniItem item={data?.proposerItem} />}
                {data?.proposerType === "SKILL" && <MiniSkill skill={data?.proposerSkill} />}
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-2">
                  <RefreshCw className="w-7 h-7 text-purple-200" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                {data?.receiverType === "ITEM" && <MiniItem item={data?.receiverItem} />}
                {data?.receiverType === "SKILL" && <MiniSkill skill={data?.receiverSkill} />}
              </div>
            </div>
          </div>

        </>
      ) : (
        <>
          <div className="flex justify-between items-center relative">
            {["Swap Details", "Schedule Meeting", "Finalize"].map(
              (label, index) => {
                const isActive = step === index + 1;
                const isDone = step > index + 1;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 relative z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
            ${isDone
                          ? "bg-green-500 text-white shadow-lg"
                          : isActive
                            ? "bg-purple-600 text-white shadow-lg scale-110"
                            : "bg-gray-700 text-gray-400"
                        }`}
                    >
                      {isDone ? <Check /> : index + 1}
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-sm transition-colors duration-300 
            ${isActive
                          ? "text-white font-medium"
                          : isDone
                            ? "text-gray-300"
                            : "text-gray-500"
                        }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              }
            )}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700">
              <div
                className="h-0.5 bg-purple-500 transition-all duration-500"
                style={{ width: `${((step - 1) / (3 - 1)) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-6 rounded-2xl border bg-[#c084fc]/10 shadow-lg">
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 p-4 rounded-xl w-full bg-[#c084fc]/15 border">
        <img
          src={data?.proposer?.image}
          alt={data?.proposer?.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-600"
        />
        <div>
          <p className="text-gray-400 text-xs">Proposed by</p>
          <p className="font-medium text-white">{data?.proposer?.name}</p>
        </div>
      </div>
      {data?.proposerType === "ITEM" && <Item item={data?.proposerItem} isSwap={false} />}
      {data?.proposerType === "SKILL" && <Skill skill={data?.proposerSkill} isSwap={false} />}
    </div>

    <div className="flex flex-col items-center justify-center gap-3">
      <div className="p-4 rounded-full bg-[#c084fc]/15 border">
        <RefreshCw className="h-7 w-7 text-gray-400" />
      </div>
      <Badge variant={getStatusVariant(swapStatus)} className="capitalize text-xs px-3 py-1.5">
        {swapStatus?.toLowerCase()}
      </Badge>
    </div>

    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 p-4 rounded-xl w-full bg-[#c084fc]/15 border">
        <img
          src={data?.receiver?.image}
          alt={data?.receiver?.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-600"
        />
        <div>
          <p className="text-gray-400 text-xs">Received by</p>
          <p className="font-medium text-white">{data?.receiver?.name}</p>
        </div>
      </div>
      {data?.receiverType === "ITEM" && <Item item={data?.receiverItem} isSwap={false} />}
      {data?.receiverType === "SKILL" && <Skill skill={data?.receiverSkill} isSwap={false} />}
    </div>
  </div>
)}



          {step === 1 && swapStatus === "ACCEPTED" && (
            <div className="flex gap-3 justify-center items-center">
              <Button variant="outline" onClick={() => navigate(-1)} size="lg">
                Back
              </Button>
              <Button size="lg" onClick={() => setStep(2)}>
                Schedule Meeting <ChevronRight />
              </Button>
            </div>
          )}

          {step === 2 && (
            <>
              {data.meeting ? (
                <div className="w-full sm:w-[500px] mx-auto space-y-6 border rounded-2xl p-6 bg-[#c084fc]/15 shadow-lg">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold text-white">
                      Meeting Scheduled
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Please review the meeting details below.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-400">Type:</span>
                      <span>
                        {data.meeting.type === "ONLINE"
                          ? "Online"
                          : "In-Person"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-400">Date:</span>
                      <span>
                        {formatPrettyIST(new Date(data.meeting.date))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-400">Status:</span>
                      <Badge
                        className={
                          data.meeting.status === "CONFIRMED"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }
                      >
                        {data.meeting.status}
                      </Badge>
                    </div>

                    {data.meeting.type === "ONLINE" ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-400">
                          Meeting Link:
                        </span>
                        <a
                          href={data.meeting.meetingLink || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline text-sm break-words"
                        >
                          {data.meeting.meetingLink}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-400">
                          Location:
                        </span>
                        <span>{data.meeting.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 flex-wrap">
                    {data.receiverId === user?.id &&
                      data.meeting?.status === "PENDING" && (
                        <Button
                          onClick={() => handleConfirmMeeting(data.id)}
                          disabled={isConfirming}
                        >
                          {isConfirming ? (
                            <>
                              <Loader2
                                className="animate-spin mr-2"
                                size={16}
                              />{" "}
                              Confirming...
                            </>
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      )}
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>

                    {data.meeting.status === "CONFIRMED" && (
                      <Button onClick={() => setStep(3)}>
                        Next <ChevronRight />
                      </Button>
                    )}
                  </div>
                </div>
              ) : user?.id === data.proposerId ? (
                <div className="flex flex-col gap-4 bg-[#c084fc]/15 p-6 rounded-2xl shadow-lg border border-gray-700">
                  <h3 className="text-xl font-semibold text-center text-white">
                    Schedule a Meeting
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300">
                      Meeting Type
                    </Label>
                    <RadioGroup
                      value={meetingData.type}
                      onValueChange={(v) =>
                        setMeetingData((prev) => ({
                          ...prev,
                          type: v as "INPERSON" | "ONLINE",
                        }))
                      }
                      className="flex gap-6"
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
                  <div className="space-y-2">
                    <Label htmlFor="meetingDate" className="text-gray-300">
                      Meeting Date
                    </Label>
                    <div className="relative">
                      <Input
                        id="meetingDate"
                        type="datetime-local"
                        value={formatToISTLocalString(meetingData.date)}
                        onChange={(e) =>
                          setMeetingData((prev) => ({
                            ...prev,
                            date: convertISTToUTC(e.target.value),
                          }))
                        }
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          (
                            document.getElementById(
                              "meetingDate"
                            ) as HTMLInputElement
                          )?.showPicker?.()
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <CalendarIcon className="text-gray-300" size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-400">
                      {formatPrettyIST(meetingData.date)}
                    </p>
                  </div>

                  {meetingData.type === "ONLINE" ? (
                    <div className="space-y-2">
                      <Label htmlFor="meetingLink" className="text-gray-300">
                        Meeting Link
                      </Label>
                      <Input
                        id="meetingLink"
                        placeholder="Meeting link"
                        value={meetingData.meetingLink}
                        onChange={(e) =>
                          setMeetingData((prev) => ({
                            ...prev,
                            meetingLink: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-300">
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="Meeting location"
                        value={meetingData.location}
                        onChange={(e) =>
                          setMeetingData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="flex justify-center gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleScheduleMeeting}
                      disabled={isScheduling}
                    >
                      {isScheduling ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        "Schedule"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-300 text-lg bg-gray-900/40 p-10 border border-gray-700 rounded-2xl shadow-lg">
                  Waiting for proposer to schedule the meeting.
                  <div className="flex justify-center gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          {step === 3 && (
            <div className="max-w-md mx-auto space-y-6 text-center border rounded-2xl p-6 bg-[#c084fc]/15 shadow-lg">
              <h3 className="text-2xl font-bold text-white">
                Finalize the Swap
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {user?.id === data.proposerId
                  ? "If the swap is successfully completed in person, click below to mark it as completed."
                  : "Only the proposer can finalize the swap once it's completed."}
              </p>

              <div className="flex justify-center gap-4 pt-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="px-6 py-2"
                >
                  Back
                </Button>
                {user?.id === data.proposerId && (
                  <Button
                    className="px-6 py-2"
                    onClick={() => handleCompleteSwap(data.id)}
                    disabled={isCompleting}
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />{" "}
                        Completing...
                      </>
                    ) : (
                      "Mark as Completed"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SwapPage;
