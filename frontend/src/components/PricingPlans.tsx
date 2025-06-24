import { useAuth } from "@/stores/useAuth";
import { Button } from "./ui/button";
import { Check, Crown } from "lucide-react";
import axios from "axios";
import { endpoint } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/clerk-react"
export default function PricingPlans() {
    const { user, fetchUser } = useAuth();
    const { getToken } = useClerkAuth();

    const proPlanAmount = 299;
    const isPro = !!user?.plan;
    const initiateRazorpay = async () => {
        const token = await getToken({template: "default" });
        try {
            const res = await axios.post(
                `${endpoint}/api/razorpay/create-order`,
                {
                    amount: proPlanAmount,
                    currency: "INR",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            const order = res.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Swapply",
                description: "Upgrade to Pro",
                order_id: order.id,
                handler: async (response: {
                    razorpay_payment_id: string;
                    razorpay_order_id: string;
                    razorpay_signature: string;
                }) => {
                    try {
                        const token = await getToken({template: "default" });
                        const result = await axios.post(
                            `${endpoint}/api/razorpay/order/validate`,
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                                withCredentials: true,
                            }
                        );

                        if (result.data.success) {
                            toast.success("You're now a Pro user! 🚀");
                            fetchUser(token)
                        } else {
                            toast.error("Payment could not be validated.");
                        }
                    } catch {
                        toast.error("Payment validation failed.");
                    }
                },
                prefill: {
                    name: user?.name || "Guest User",
                    email: user?.email || "guest@example.com",
                },
                theme: {
                    color: "#a855f7",
                },
            };

            //@ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            toast.error("Failed to upgrade to Pro.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full justify-center items-stretch">
                <div className="relative border rounded-3xl shadow-xl flex-1 max-w-sm w-full p-8 flex flex-col items-center transition duration-300">
                    <h2 className="text-2xl font-bold text-white mb-2">Free</h2>
                    <div className="flex items-end justify-center mb-6">
                        <span className="text-4xl font-extrabold text-white">₹0</span>
                        <span className="text-base text-gray-400 ml-1 mb-1">/month</span>
                    </div>
                    <ul className="text-left mb-8 w-full">
                        {[
                            "List up to 5 items",
                            "2 swaps per month",
                            "Standard swapping",
                            "Public circles",
                        ].map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-300 mb-3">
                                <Check size={18} className="text-[#c084fc]" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <Link to={"/login"} className="w-full">
                        <Button
                            className="w-full py-2 rounded-xl font-semibold text-base"
                            size="lg"
                            variant="outline"
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="relative border-2 rounded-3xl shadow-2xl flex-1 max-w-sm w-full p-8 flex flex-col items-center border-[#c084fc] scale-[1.08] z-10 transition duration-300 shadow-purple-500/30 ">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c084fc] text-black px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                        <Crown size={13} className="text-black fill-black" /> Most Popular
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
                    <div className="flex items-end justify-center mb-6">
                        <span className="text-4xl font-extrabold text-white">₹{proPlanAmount}</span>
                        <span className="text-base text-gray-400 ml-1 mb-1">/month</span>
                    </div>
                    <ul className="text-left mb-8 w-full">
                        {[
                            "Unlimited item listings",
                            "Unlimited swaps",
                            "Unlimited product boosts",
                            "Verified badge",
                            "Private circles",
                        ].map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-300 mb-3">
                                <Check size={18} className="text-[#c084fc]" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    {user ? (
                        isPro ? (
                            <Button
                                className="w-full py-2 rounded-xl font-semibold text-base cursor-default"
                                size="lg"
                                disabled
                            >
                                You&apos;re on Pro 🎉
                            </Button>
                        ) : (
                            <Button
                                className="w-full py-2 rounded-xl font-semibold text-base bg-[#c084fc] hover:bg-[#a855f7] text-black transition-colors duration-200"
                                size="lg"
                                onClick={initiateRazorpay}
                            >
                                Upgrade to Pro
                            </Button>
                        )
                    ) : (

                        <Button
                            className="w-full py-2 rounded-xl font-semibold text-base"
                            size="lg"
                            variant="outline"
                            asChild
                        >
                            <Link to={"/login"}> Sign in to Upgrade</Link>

                        </Button>
                    )}

                </div>
            </div>
        </div>
    );
}
