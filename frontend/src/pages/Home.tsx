import Logo from "@/components/Logo";
import PricingPlans from "@/components/PricingPlans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import clsx from "clsx";
function Home() {
  return (

    <div className="pb-10 w-full">

      <div className="relative min-h-screen overflow-hidden text-white">
        <div className="absolute inset-0 z-10 pointer-events-none perspective-[800px] overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              transform: "rotateX(35deg) scale(1.1) translateY(-40px)",
              transformOrigin: "top",
              backgroundColor: "#0d0d0d",
              backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(192, 132, 252, 0.25), transparent 100%)",
              transform: "translateZ(0)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, #0d0d0d 15%, transparent 60%)",
            }}
          />

        </div>


        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d0a2fd]/20  text-xs sm:text-sm text-white mb-4 animate-fade-in">
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            A P2P bartering platform
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight bg-gradient-to-r from-white via-purple-200 to-[#d0a2fd] bg-clip-text text-transparent break-words text-balance max-w-2xl sm:max-w-3xl animate-fade-in-up">
            Swap Your Unused Stuff for What You Love
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-white/80 max-w-md sm:max-w-xl animate-fade-in-up delay-200">
            Turn unused items into value. List, browse, and swap with your local community - quick and easy.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
            <Button variant={"default"} className="w-full sm:w-40 p-5" asChild>
              <Link to={"/browse/items"}>
                <span className="font-bold flex items-center justify-center gap-2">
                  Get Started <ChevronRight />
                </span>
              </Link>
            </Button>
          </div>

          <div className="mt-16 flex md:flex-row items-center justify-center gap-6 animate-fade-in-up delay-500 max-w-4xl mx-auto text-center">
            {[
              { icon: Package, label: "List Item" },
              { icon: Search, label: "Browse" },
              { icon: RefreshCw, label: "Swap" },
            ].map(({ icon: Icon, label }, idx) => (
              <>
                <div className="flex flex-col items-center gap-3 group">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#c084fc]/20 to-purple-600/10 border border-[#c084fc]/30 shadow-lg shadow-[#c084fc]/25 transition-all duration-300">
                    <Icon className="w-7 h-7 text-[#c084fc]" />
                  </div>
                  <span className="text-sm text-white font-medium break-words max-w-[80px]">{label}</span>
                </div>
                {idx < 2 && (
                  <div className="hidden md:flex items-center">

                    <div className="w-16 h-px bg-gradient-to-r from-[#c084fc]/50 to-transparent mx-2" />
                    <ArrowRight className="w-6 h-6 text-[#c084fc] opacity-70 animate-pulse" />
                  </div>
                )}
              </>
            ))}
          </div>

        </div>

      </div>




      <section className="py-20 bg-[#0d0d0d] text-white w-full">
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
                  className="relative group w-full sm:w-[300px] min-h-[270px] rounded-2xl p-[1px] bg-gradient-to-br from-[#c084fc]/40 to-[#c084fc]/50 shadow-2xl hover:shadow-purple-500/40 transition-all duration-500"
                >
                  <div className="relative z-10 rounded-2xl p-6 bg-[#0d0d0d]/80 backdrop-blur-xl flex flex-col justify-between gap-5 h-full overflow-hidden min-h-[300px]">

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-gradient-to-br from-[#c084fc]/10 to-transparent z-0 pointer-events-none" />

                    <div className="relative w-fit p-3 rounded-xl bg-[#c084fc]/10 shadow-lg shadow-[#c084fc]/15 z-10">
                      <Icon className="w-6 h-6 text-[#c084fc]" />
                    </div>
                    <div className="w-fit text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-[#c084fc]/20 to-[#a855f7]/20 text-[#c084fc] shadow-sm shadow-[#c084fc]/10 z-10">
                      {step}
                    </div>

                    <h3 className="text-2xl font-semibold text-white z-10">{title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed z-10">{description}</p>
                    <div className="mt-auto z-10 h-[1.5px] w-[80%] self-center bg-gradient-to-r from-transparent via-[#c084fc]/50 to-transparent blur-sm opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>





                {index < arr.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <div className="w-16 h-px bg-gradient-to-r from-[#c084fc]/50 to-transparent mx-2" />
                    <ArrowRight className="w-6 h-6 text-[#c084fc] opacity-70 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d0d0d] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge className="mb-6 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30">
            <Sparkles className="w-4 h-4" />
            Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-[#d0a2fd] bg-clip-text">
            Why Choose Swapply?
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-16">
            Experience the future of peer-to-peer trading with our innovative platform
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Users className="w-5 h-5 text-[#c084fc]" />,
                title: "Circles",
                content:
                  "Create or join communities based on interests, location, or item categories. Connect with like-minded users to share, swap, and discuss items.",
                span: "lg:col-span-2",
              },
              {
                icon: <RefreshCw className="w-5 h-5 text-[#c084fc]" />,
                title: "Smart Swapping",
                content:
                  "Browse a wide range of items and send personalized swap proposals.",
              },
              {
                icon: <Rocket className="w-5 h-5 text-[#c084fc]" />,
                title: "Boost Items",
                content:
                  "Increase the visibility of your listings using our premium boosting tools.",
              },
              {
                icon: <Shield className="w-5 h-5 text-[#c084fc]" />,
                title: "Item Score",
                content:
                  "Get insights into quality based on age, bill, and condition of items.",
                span: "lg:col-span-2",
              },
              {
                icon: <BadgeCheck className="w-5 h-5 text-[#c084fc]" />,
                title: "Verified Badge",
                content:
                  "Build trust with badges that indicate verified, trustworthy users.",
                span: "lg:col-span-3",
              },
            ].map(({ icon, title, content, span }, idx) => (
              <div
                key={idx}
                className={clsx(
                  "relative p-[1px] rounded-2xl bg-gradient-to-br from-[#c084fc]/40 to-[#c084fc]/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl hover:shadow-purple-500/40",
                  span
                )}
              >
                <div className="bg-[#0d0d0d]/90 backdrop-blur-xl rounded-2xl p-6 h-full flex flex-col gap-4 text-left">
                  <div className="w-10 h-10 p-2 rounded-md bg-[#c084fc]/10 border border-[#c084fc]/30">
                    {icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">
                    {title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                    {content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-40 bg-[#0d0d0d]">
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

      <div className="bg-[#0d0d0d]">
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

        <footer className=" text-white py-12 px-6 md:px-8 ">
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
              className="font-semibold text-white underline"
            >
              Jems Labs
            </a>
            . Developed by{' '}
            <a
              href="https://x.com/isonikrish"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline"
            >
              Krish Soni
            </a>
          </div>

        </footer>
      </div>

    </div>

  );
}

export default Home;
