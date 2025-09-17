import { useApp } from "@/stores/useApp";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RefreshCw,
  Loader2,
  Check,
  CheckCircle,
  ChevronRight,
  Copy,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useAuth } from "@/stores/useAuth";
import { useState } from "react";
import MiniItem from "@/components/MiniItem";
import MiniSkill from "@/components/MiniSkill";
import Item from "@/components/Item";
import Skill from "@/components/Skill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

function SwapPage() {
  const { getSwap, addPhoneNumber, completeSwap, verifyProposerCode, verifyReceiverCode } = useApp();
  const { id } = useParams();
  const { user } = useAuth();
  const { getToken } = useClerkAuth();
  const [step, setStep] = useState(1)
  const queryClient = useQueryClient();
  const swapId = id ? parseInt(id) : undefined;
  const [proposerPhone, setProposerPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverCode, setReceiverCode] = useState("");
  const [proposerCode, setProposerCode] = useState("")
  const [isSavingNumber, setIsSavingNumber] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

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

  const handleAddPhoneNumber = async (type: "proposer" | "receiver") => {
    const token = await getToken({ template: "default" });
    const phoneData = { "swapRequestId": data?.id, "number": type === "proposer" ? proposerPhone : receiverPhone }
    setIsSavingNumber(true)
    await addPhoneNumber(phoneData, token);
    setIsSavingNumber(false)
    queryClient.invalidateQueries({ queryKey: ["swap", swapId] });
  }

  const handleVerifyProposerCode = async () => {
    const token = await getToken({ template: "default" });
    if (!data?.process?.id) return;

    const verifyProposerCodeData = {
      code: proposerCode,
      swapProcessId: data?.process?.id
    };

    setIsVerifying(true);
    await verifyProposerCode(verifyProposerCodeData, token);
    setIsVerifying(false);
    queryClient.invalidateQueries({ queryKey: ["swap", swapId] });
  };

  const handleVerifyReceiverCode = async () => {
    const token = await getToken({ template: "default" });
    if (!data?.process?.id) return;

    const verifyReceiverCodeData = {
      code: receiverCode,
      swapProcessId: data?.process?.id
    };

    setIsVerifying(true);
    await verifyReceiverCode(verifyReceiverCodeData, token);
    setIsVerifying(false);
    queryClient.invalidateQueries({ queryKey: ["swap", swapId] });
  };

  const handleMarkAsCompleted = async () => {
    const token = await getToken({ template: "default" });
    setIsCompleting(true)
    await completeSwap(data.id, token)
    setIsCompleting(false)
  }

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
        <div>
          <div>
            <div className="flex justify-between items-center relative mb-8">
              {["Swap Details", "Add Phone Number", "Verify Swap Codes", "Mark as Completed"].map(
                (label, index) => {
                  const isActive = step === index + 1;
                  const isDone = step > index + 1;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1 relative z-10 "
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${isDone
                          ? "bg-green-500 text-white shadow-md"
                          : isActive
                            ? "bg-purple-600 text-white shadow-md scale-110"
                            : "bg-[#2a202d]/90 text-gray-500 border border-gray-600"
                          }`}
                      >
                        {isDone ? <Check className="w-5 h-5" /> : index + 1}
                      </div>
                      <span
                        className={`mt-2 text-xs sm:text-sm transition-colors duration-300 text-center
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

              <div className="absolute top-5 left-0 right-0 h-1 bg-[#2a202d]/90 rounded-full">
                <div
                  className="h-1 bg-purple-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((step - 1) / (4 - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {step === 1 &&
            <div className="flex flex-col gap-3">
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
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={swapStatus !== "ACCEPTED"}>Next <ChevronRight /></Button>
              </div>
            </div>
          }

          {step === 2 && swapStatus === "ACCEPTED" && (
            <div className="flex flex-col gap-6">
              <div className="bg-[#c084fc]/10 p-8 rounded-2xl space-y-6">
                <div className="space-y-3 ">
                  <h1 className="font-bold text-2xl text-white">Exchange Phone Numbers</h1>
                  <p className="text-gray-300 text-sm ">
                    Add your number so you both can connect directly to finish the swap.
                  </p>
                  <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg px-4 py-3 text-purple-200 text-sm font-medium">
                    Numbers are private and shared only between you two.
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={data?.proposer?.image}
                      alt={data?.proposer?.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-600"
                    />
                    <div>
                      <p className="text-sm text-gray-400">Proposer</p>
                      <p className="text-white font-medium">{data?.proposer?.name}</p>
                    </div>
                  </div>

                  {data?.process?.proposerPhoneNumber ? (
                    <div className="px-4 py-3 bg-background  rounded-lg border border-[#c084fc]/10 text-white">
                      📞 +91 {data?.process?.proposerPhoneNumber}
                    </div>
                  ) : (
                    <div className="relative flex gap-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        +91
                      </span>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        value={proposerPhone}
                        onChange={(e) =>
                          setProposerPhone(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter phone number"
                        className="pl-14"
                        disabled={user?.id !== data?.proposer?.id}
                      />
                      {user?.id === data?.proposer?.id && (
                        <Button
                          size="sm"
                          onClick={() => handleAddPhoneNumber("proposer")}
                          disabled={isSavingNumber}
                        >
                          {isSavingNumber ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                          Save
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={data?.receiver?.image}
                      alt={data?.receiver?.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-600"
                    />
                    <div>
                      <p className="text-sm text-gray-400">Receiver</p>
                      <p className="text-white font-medium">{data?.receiver?.name}</p>
                    </div>
                  </div>

                  {data?.process?.receiverPhoneNumber ? (
                    <div className="px-4 py-3 bg-background  rounded-lg border border-[#c084fc]/10 text-white">
                      📞 +91 {data?.process?.receiverPhoneNumber}
                    </div>
                  ) : (
                    <div className="relative flex gap-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        +91
                      </span>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        value={receiverPhone}
                        onChange={(e) =>
                          setReceiverPhone(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter phone number"
                        className="pl-14"
                        disabled={user?.id !== data?.receiver?.id}
                      />
                      {user?.id === data?.receiver?.id && (
                        <Button
                          size="sm"
                          onClick={() => handleAddPhoneNumber("receiver")}
                          disabled={isSavingNumber}
                        >
                          {isSavingNumber ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                          Save
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={() => setStep(1)} variant="outline">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!data?.process?.proposerPhoneNumber ||
                  !data?.process?.receiverPhoneNumber}>
                  Next <ChevronRight />
                </Button>
              </div>
            </div>
          )}


          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="bg-[#c084fc]/10 p-8 rounded-2xl">
                <div className="space-y-3">
                  <h1 className="font-bold text-2xl text-white">Verify Swap Codes</h1>
                  <p className="text-gray-300 text-sm">
                    Both parties must share and verify codes to ensure the swap is secure.
                  </p>
                </div>

                <div className="mt-6 space-y-8">
                  {/* Proposer Section */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={data?.proposer?.image}
                          alt={data?.proposer?.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600"
                        />
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm text-gray-400">Proposer</p>
                            <p className="text-white font-medium">{data?.proposer?.name}</p>
                          </div>
                          {data?.process?.isProposerCodeVerified && (
                            <CheckCircle className="text-green-500 w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {user?.id === data?.proposer?.id && (
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-2 bg-background rounded-lg border border-[#c084fc]/10 text-white font-mono">
                            {data?.process?.proposerSwapCode}
                          </div>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              navigator.clipboard.writeText(data?.process?.proposerSwapCode || "")
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {user?.id === data?.receiver?.id && (
                      <>
                        {!data?.process?.isProposerCodeVerified ? (
                          <div className="flex items-center gap-3 justify-end">
                            <InputOTP
                              maxLength={4}
                              value={proposerCode}
                              onChange={setProposerCode}
                              className="flex-1 max-w-[180px]"
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                              </InputOTPGroup>
                            </InputOTP>
                            <Button
                              size="sm"
                              onClick={handleVerifyProposerCode}
                              disabled={isVerifying}
                            >
                              {isVerifying && <Loader2 className="animate-spin mr-2" size={16} />}
                              Verify
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end text-green-500 text-sm font-medium gap-1">
                            <CheckCircle className="w-4 h-4" /> Proposer code verified
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Receiver Section */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={data?.receiver?.image}
                          alt={data?.receiver?.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600"
                        />
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm text-gray-400">Receiver</p>
                            <p className="text-white font-medium">{data?.receiver?.name}</p>
                          </div>
                          {data?.process?.isReceiverCodeVerified && (
                            <CheckCircle className="text-green-500 w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {user?.id === data?.receiver?.id && (
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-2 bg-background rounded-lg border border-[#c084fc]/10 text-white font-mono">
                            {data?.process?.receiverSwapCode}
                          </div>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              navigator.clipboard.writeText(data?.process?.receiverSwapCode || "")
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {user?.id === data?.proposer?.id && (
                      <>
                        {!data?.process?.isReceiverCodeVerified ? (
                          <div className="flex items-center gap-3 justify-end">
                            <InputOTP
                              maxLength={4}
                              value={receiverCode}
                              onChange={setReceiverCode}
                              className="flex-1 max-w-[180px]"
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                              </InputOTPGroup>
                            </InputOTP>
                            <Button
                              size="sm"
                              onClick={handleVerifyReceiverCode}
                              disabled={isVerifying}
                            >
                              {isVerifying && <Loader2 className="animate-spin mr-2" size={16} />}
                              Verify
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end text-green-500 text-sm font-medium gap-1">
                            <CheckCircle className="w-4 h-4" /> Receiver code verified
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={() => setStep(2)} variant="outline">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={
                    !data?.process?.isProposerCodeVerified ||
                    !data?.process?.isReceiverCodeVerified
                  }
                >
                  Next <ChevronRight />
                </Button>
              </div>
            </div>
          )}


          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div className="bg-[#c084fc]/10 p-8 rounded-2xl">
                <h1 className="font-bold text-2xl text-white mb-2">Finalize Swap</h1>
                <p className="text-gray-300 text-sm mb-6">
                  Both codes have been verified successfully.
                  {user?.id === data?.proposer?.id
                    ? " Please confirm to mark this swap as completed."
                    : " Waiting for the proposer to mark this swap as completed."}
                </p>

                <div className="flex items-center justify-between">
                  <Button onClick={() => setStep(3)} variant="outline">
                    Back
                  </Button>

                  {user?.id === data?.proposer?.id ? (
                    <Button
                      onClick={handleMarkAsCompleted}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isCompleting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Check />}
                      Mark as Completed
                    </Button>
                  ) : (
                    <p className="text-gray-300 text-sm italic">
                      ⏳ Waiting for proposer to complete
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}



        </div>
      )}
    </div>
  );
}

export default SwapPage;
