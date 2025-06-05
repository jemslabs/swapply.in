import Logo from "@/components/Logo";
import PricingPlans from "@/components/PricingPlans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Package,
    Search,
    ArrowRight,
    RefreshCw,
    Target,
    Users,
    Shield,
    Sparkles,
    Rocket,
    BadgeCheck,
    BadgePercent,
    ChevronRight,
    Github
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
function Home() {
    return (
        <div className="bg-black pb-10 w-full min-h-screen overflow-x-hidden">
            <div className="relative min-h-screen overflow-hidden bg-black text-white">
                <div className="absolute inset-0 h-1/2 bg-gradient-to-b from-[rgb(131,78,184)] to-transparent z-0" />

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center max-w-5xl mx-auto">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c084fc]/10 border border-[#c084fc]/60 text-xs sm:text-sm text-white mb-4 animate-fade-in">
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                        A P2P bartering platform
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight max-w-4xl animate-fade-in-up">
                        Swap Your Unused Stuff for What You Love
                    </h1>

                    <p className="mt-6 text-sm sm:text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in-up delay-200">
                        Swap items you no longer need for the things you actually want. Connect,
                        trade, and make someone's trash your next treasure.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
                        <Button variant={"default"} className="w-full sm:w-40 p-5">
                            <Link to={"/login"} className="flex items-center justify-center gap-2">
                                Get Started <ChevronRight />
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-20 flex flex-row  items-center justify-center gap-3 animate-fade-in-up delay-300 max-w-3xl text-center">
                        <div className="flex flex-col items-center gap-1">
                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-[#c084fc]" />
                            <span className="text-xs sm:text-sm text-white/80">List your item</span>
                        </div>

                        <ArrowRight className="w-5 h-5 text-[#c084fc] opacity-70" />

                        <div className="flex flex-col items-center gap-1">
                            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-[#c084fc]" />
                            <span className="text-xs sm:text-sm text-white/80">Browse items</span>
                        </div>

                        <ArrowRight className="w-5 h-5 text-[#c084fc] opacity-70" />

                        <div className="flex flex-col items-center gap-1">
                            <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-[#c084fc]" />
                            <span className="text-xs sm:text-sm text-white/80">Swap & enjoy</span>
                        </div>
                    </div>
                </div>
            </div>


            <Separator />
            <section className="py-16 bg-black text-white min-h-screen w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30">
                            <Target className="w-4 h-4" />
                            Process
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">How It Works</h2>
                        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                            Get started with swapping in just a few simple steps
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 flex-wrap">
                        {[
                            {
                                icon: Package,
                                step: "Step 1",
                                title: "List your item",
                                description: "List items you no longer use and are open to trading.",
                            },
                            {
                                icon: Search,
                                step: "Step 2",
                                title: "Browse Items",
                                description: "Explore the community's listings and find the perfect match for your item.",
                            },
                            {
                                icon: RefreshCw,
                                step: "Step 3",
                                title: "Swap & Enjoy",
                                description: "Make the trade and enjoy your newly swapped treasure.",
                            },
                        ].map(({ icon: Icon, step, title, description }) => (
                            <div key={step} className="flex items-center justify-center w-full sm:w-auto">
                                <div className="glow-border w-full sm:w-72 min-h-[300px] flex-shrink-0 flex flex-col">
                                    <div className="glow-border-inner p-6 flex flex-col flex-grow">
                                        <Icon size={40} className="text-[#c084fc] mb-4" />
                                        <Badge className="mb-4 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30">
                                            {step}
                                        </Badge>
                                        <h3 className="text-xl sm:text-2xl font-semibold mb-2">{title}</h3>
                                        <p className="text-sm sm:text-base text-white/70">{description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Separator />
            <section className="py-16 bg-black">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30">
                            <Sparkles className="w-4 h-4" />
                            Features
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-4">Why Choose Swapply?</h2>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            Experience the future of peer-to-peer trading with our innovative platform
                        </p>
                    </div>

                    <div className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Circles */}
                        <div className="glow-border sm:col-span-2 lg:col-span-2">
                            <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
                                <CardHeader>
                                    <div className="border p-2 w-10 h-10 rounded-md">
                                        <Users className="w-6 h-6 text-[#c084fc]" />
                                    </div>
                                    <CardTitle className="text-white text-2xl">Circles</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/70">
                                        Create or join communities based on interests, location, or item categories. Connect with like-minded users to share, swap, and discuss items.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="glow-border">
                            <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
                                <CardHeader>
                                    <div className="border p-2 w-10 h-10 rounded-md">
                                        <RefreshCw className="w-6 h-6 text-[#c084fc]" />
                                    </div>
                                    <CardTitle className="text-white text-2xl">Smart Swapping</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/70">
                                        Browse a wide range of items available for swap and send personalized swap proposals to other users.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Boost Items */}
                        <div className="glow-border">
                            <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
                                <CardHeader>
                                    <div className="border p-2 w-10 h-10 rounded-md">
                                        <Rocket className="w-6 h-6 text-[#c084fc]" />
                                    </div>
                                    <CardTitle className="text-white text-2xl">Boost Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/70">
                                        Increase visibility of your items with premium boosting features.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Item Score */}
                        <div className="glow-border sm:col-span-2 lg:col-span-2">
                            <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
                                <CardHeader>
                                    <div className="border p-2 w-10 h-10 rounded-md">
                                        <Shield className="w-6 h-6 text-[#c084fc]" />
                                    </div>
                                    <CardTitle className="text-white text-2xl">Item Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/70">
                                        Shows the score of an item based on its age, bill availability, and condition, helping users find products that meet their desired quality and reliability.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Verified Badge */}
                        <div className="glow-border sm:col-span-2 lg:col-span-3">
                            <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
                                <CardHeader>
                                    <div className="border p-2 w-10 h-10 rounded-md">
                                        <BadgeCheck className="w-6 h-6 text-[#c084fc]" />
                                    </div>
                                    <CardTitle className="text-white text-2xl">Verified Badge</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/70">
                                        Helps build trust in bartering by displaying a verified badge on users that meet our quality and reliability standards.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Separator />
            <section className="py-16 bg-black">
               <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30">
                            <BadgePercent className="w-4 h-4" />
                            Pricing
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-white">Choose Your Plan</h2>
                        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                            Get started for free. Upgrade to Pro for full access and premium benefits.
                        </p>

                    </div>
                    <div className="w-full">
                        <PricingPlans />
                    </div>
                </div>
            </section>

            <div className="bg-black">
                <section className="py-20 bg-[rgb(100,42,154)] text-white mx-4 md:mx-20 rounded-2xl relative overflow-hidden">
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: "radial-gradient(white 1px, transparent 0)",
                            backgroundSize: "10px 10px",
                            backgroundRepeat: "repeat",
                        }}
                    />

                    <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center px-6">
                        <h2 className="text-4xl md:text-5xl font-semibold mb-6">
                            Ready to Start Swapping?
                        </h2>
                        <p className="text-lg md:text-xl text-purple-200/90 max-w-3xl mb-10">
                            Discover unique items, build meaningful connections, and embrace a
                            sustainable lifestyle through swapping.
                        </p>
                        <Button variant="secondary" className="w-40 p-5">
                            <Link to="/login" className="flex items-center gap-2">
                                Get Started <ChevronRight className="w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </section>

                <footer className="bg-black text-white py-12 px-6 md:px-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <Logo />
                            <p className="mt-4 text-white/80 text-sm leading-relaxed max-w-md">
                                Swapply is a P2P bartering platform. Trade items directly with others — sneakers, gadgets, books, and more.
                                List, browse, and swap easily within a trusted community.
                            </p>
                        </div>

                        <div className="flex md:justify-end items-center gap-6">
                            <a
                                href="https://github.com/Jems-Labs/swapply"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#c084fc] transition-transform hover:scale-110"
                                aria-label="GitHub"
                            >
                                <Github className="w-6 h-6" />
                            </a>
                            <a
                                href="https://x.com/jems_labs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#c084fc] transition-transform hover:scale-110"
                                aria-label="X (Twitter)"
                            >
                                <FaXTwitter className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.youtube.com/@JemsLabs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#c084fc] transition-transform hover:scale-110"
                                aria-label="YouTube"
                            >
                                <FaYoutube className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    <div className="py-10">
                        <Separator />
                    </div>

                    <div className="text-center text-white/70 text-sm pb-4">
                        © {new Date().getFullYear()} Swapply. A product by{' '}
                        <a
                            href="https://jemslabs.xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white hover:underline"
                        >
                            Jems Labs
                        </a>.
                    </div>
                </footer>
            </div>

        </div>
    );
}

export default Home;
