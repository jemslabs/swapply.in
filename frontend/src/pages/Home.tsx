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
import { useState } from "react";

function Home() {
    const [showMoreFeatures, setShowMoreFeatures] = useState(false)
    return (
        <div className="bg-black pb-10 w-full min-h-screen overflow-x-hidden">
            <div className="relative min-h-screen overflow-hidden bg-black text-white">
                <div className="absolute inset-0 h-1/2 bg-gradient-to-b from-[rgb(79,46,111)] to-transparent z-0" />

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c084fc]/10 border border-[#c084fc]/60 text-xs sm:text-sm text-white mb-4 animate-fade-in">
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                        A P2P bartering platform
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight bg-gradient-to-r from-white via-purple-200 to-[#d0a2fd] bg-clip-text text-transparent break-words text-balance max-w-2xl sm:max-w-3xl animate-fade-in-up">
                        Swap Your Unused Stuff for What You Love
                    </h1>

                    <p className="mt-5 text-sm sm:text-base md:text-lg text-white/80 max-w-md sm:max-w-xl animate-fade-in-up delay-200">
                        Turn unused items into value. List, browse, and swap with your local community—quick and easy.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
                        <Button variant={"default"} className="w-full sm:w-40 p-5" asChild>
                            <Link to={"/login"}>
                                <span className="font-bold flex items-center justify-center gap-2">
                                    Get Started <ChevronRight />
                                </span>
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-16 flex  md:flex-row items-center justify-center gap-6 animate-fade-in-up delay-500 max-w-4xl mx-auto text-center">
                        <div className="flex flex-col items-center gap-3 group">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 shadow-lg shadow-[#c084fc]/25 transition-all duration-300">
                                <Package className="w-7 h-7 text-[#c084fc]" />
                            </div>
                            <span className="text-sm text-white font-medium break-words max-w-[80px]">List Item</span>
                        </div>

                        <div className="hidden md:flex items-center">
                            <ArrowRight className="w-6 h-6 text-[#c084fc] opacity-70 animate-pulse" />
                            <div className="w-16 h-px bg-gradient-to-r from-[#c084fc]/50 to-transparent mx-2" />
                        </div>

                        <div className="flex flex-col items-center gap-3 group">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 shadow-lg shadow-[#c084fc]/25 transition-all duration-300">
                                <Search className="w-7 h-7 text-[#c084fc]" />
                            </div>
                            <span className="text-sm text-white font-medium break-words max-w-[80px]">Browse</span>
                        </div>

                        <div className="hidden md:flex items-center">
                            <ArrowRight className="w-6 h-6 text-[#c084fc] opacity-70 animate-pulse delay-500" />
                            <div className="w-16 h-px bg-gradient-to-r from-[#c084fc]/50 to-transparent mx-2" />
                        </div>

                        <div className="flex flex-col items-center gap-3 group">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 shadow-lg shadow-[#c084fc]/25 transition-all duration-300">
                                <RefreshCw className="w-7 h-7 text-[#c084fc]" />
                            </div>
                            <span className="text-sm text-white font-medium break-words max-w-[80px]">Swap</span>
                        </div>
                    </div>
                </div>

            </div>


            <div className="w-full relative -mt-1 z-20">
                <svg
                    className="w-full h-24"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,64L48,80C96,96,192,128,288,160C384,192,480,224,576,224C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        fill="url(#gradient)"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0b0b0b" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <section className="py-20 bg-black text-white w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30">
                            <Target className="w-4 h-4" />
                            Process
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
                            How It Works
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                            Start swapping in just three simple steps
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 flex-wrap">
                        {[
                            {
                                icon: Package,
                                step: "Step 1",
                                title: "List Your Item",
                                description:
                                    "Add your unused items with a short description and pictures to attract matches.",
                            },
                            {
                                icon: Search,
                                step: "Step 2",
                                title: "Browse & Match",
                                description:
                                    "Find items you want, view detailed listings, and request a swap with just a click.",
                            },
                            {
                                icon: RefreshCw,
                                step: "Step 3",
                                title: "Swap & Enjoy",
                                description:
                                    "Seal the deal, track your swap, and enjoy what you got in return.",
                            },
                        ].map(({ icon: Icon, step, title, description }, index, arr) => (
                            <div key={step} className="flex items-center gap-4">
                                <div
                                    className="relative border border-[#c084fc]/60 rounded-2xl p-6 w-full sm:w-[300px] shadow-xl backdrop-blur-md transition-transform duration-300 shadow-purple-500/20"
                                >
                                    <div className="flex flex-col gap-4 h-full">
                                        <div className="p-3 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/30 shadow-inner shadow-[#c084fc]/10 w-fit">
                                            <Icon className="w-6 h-6 text-[#c084fc]" />
                                        </div>
                                        <div className="w-fit bg-[#c084fc]/10 text-[#c084fc] border border-[#c084fc]/30 rounded-full px-3 py-1 text-sm">
                                            {step}
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-semibold">{title}</h3>
                                        <p className="text-sm sm:text-base text-white/70">{description}</p>
                                    </div>
                                </div>

                                {index < arr.length - 1 && (
                                    <ArrowRight className="hidden md:block w-8 h-8 text-[#c084fc] opacity-80" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <div className="w-full relative -mt-1 z-20">
                <svg
                    className="w-full h-24"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,64L48,80C96,96,192,128,288,160C384,192,480,224,576,224C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        fill="url(#gradient)"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0b0b0b" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
             <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30">
            <Sparkles className="w-4 h-4" />
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 text-white">Why Choose Swapply?</h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Experience the future of peer-to-peer trading with our innovative platform
          </p>
        </div>

        <div className="w-full grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="glow-border rounded-lg sm:col-span-2 lg:col-span-2">
            <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
              <CardHeader>
                <div className="rounded-md bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 w-10 h-10 p-2">
                  <Users className="w-5 h-5 text-[#c084fc]" />
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

          {/* Feature 2 */}
          <div className="glow-border">
            <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
              <CardHeader>
                <div className="rounded-md bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 w-10 h-10 p-2">
                  <RefreshCw className="w-5 h-5 text-[#c084fc]" />
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

          {/* Feature 3 */}
          <div className="glow-border">
            <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
              <CardHeader>
                <div className="rounded-md bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 w-10 h-10 p-2">
                  <Rocket className="w-5 h-5 text-[#c084fc]" />
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

          {/* Show more button - visible only on mobile */}
          {!showMoreFeatures && (
            <div className="sm:hidden text-center mt-4">
              <Button
                variant="link"
                className="underline text-[#c084fc]"
                onClick={() => setShowMoreFeatures(true)}
              >
                Show more
              </Button>
            </div>
          )}

          {/* Additional Features - Only rendered if showMoreFeatures is true */}
          {showMoreFeatures && (
            <>
              {/* Feature 4 */}
              <div className="glow-border sm:col-span-2 lg:col-span-2">
                <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
                  <CardHeader>
                    <div className="rounded-md bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 w-10 h-10 p-2">
                      <Shield className="w-5 h-5 text-[#c084fc]" />
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

              {/* Feature 5 */}
              <div className="glow-border sm:col-span-2 lg:col-span-3">
                <Card className="h-full bg-black border border-white/10 hover:border-[#c084fc] transition-all duration-300 hover:scale-[1.02] group cursor-pointer glow-border-inner">
                  <CardHeader>
                    <div className="rounded-md bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 w-10 h-10 p-2">
                      <BadgeCheck className="w-5 h-5 text-[#c084fc]" />
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

              {/* Show less button - visible only on mobile */}
              <div className="sm:hidden text-center mt-2">
                <Button
                  variant="link"
                  className="underline text-[#c084fc]"
                  onClick={() => setShowMoreFeatures(false)}
                >
                  Show less
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>

            <div className="w-full relative -mt-1 z-20">
                <svg
                    className="w-full h-24"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,64L48,80C96,96,192,128,288,160C384,192,480,224,576,224C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        fill="url(#gradient)"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0b0b0b" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <section className="py-20 bg-black">
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
                        <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-10">
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
