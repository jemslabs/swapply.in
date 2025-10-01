import Logo from "@/components/Logo";
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
  Github,
  Bell,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="pb-10 w-full bg-[#0d0d0d]">
      <div className="relative  bg-[#0d0d0d] text-white overflow-hidden pt-20 pb-10">
        <div className="absolute inset-0">
          <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] bg-purple-500/30 blur-[120px] sm:blur-[150px] md:blur-[180px] rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[900px] md:h-[900px] bg-fuchsia-600/20 blur-[180px] sm:blur-[220px] md:blur-[250px] rounded-full"></div>
        </div>


        <div className="absolute inset-0 z-0 pointer-events-none perspective-[800px] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              transform: "rotateX(35deg) scale(1.2) translateY(-60px)",
              transformOrigin: "top",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 sm:py-20 text-center max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] sm:leading-[1.15]">
            <span className="block bg-gradient-to-r from-white via-purple-200 to-[#d0a2fd] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Swap Your Stuff
            </span>
            <span className="block mt-0.5 sm:mt-1 bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              For What You Love
            </span>
          </h1>


          <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg lg:text-xl text-white/80 max-w-xs sm:max-w-2xl animate-fade-in-up delay-150 leading-relaxed">
            Swap unused items or skills into real value. Trade without money — simple, sustainable, fun.
          </p>


          <div className="mt-5 sm:mt-8">
            <Link to={"/browse"}>
              <Button
                size="lg"
                className="transition-all rounded-xl flex items-center justify-center gap-x-2 px-5 sm:px-6 py-2 sm:py-3 w-[140px] sm:w-[180px] h-[42px] sm:h-[50px] text-sm sm:text-base font-medium"
              >
                Get Started <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 sm:mt-20 w-full max-w-md sm:max-w-3xl lg:max-w-6xl mx-auto animate-fade-in-up delay-500 px-2">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_0_25px_rgba(168,85,247,0.5)] sm:shadow-[0_0_80px_rgba(168,85,247,0.5)]"></div>

              <img
                src="/swapply_browse.png"
                alt="Browse Page Preview"
                className="relative rounded-2xl sm:rounded-3xl transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 blur-xl sm:blur-3xl opacity-50 sm:opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </div>
      </div>


      <section className="relative py-20 sm:py-28 text-white w-full bg-[#0d0d0d] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-36 sm:top-40 left-1/2 -translate-x-1/2 w-72 sm:w-[700px] h-72 sm:h-[700px] bg-purple-600/20 blur-[120px] sm:blur-[200px] rounded-full"></div>
          <div className="absolute bottom-0 left-1/3 w-60 sm:w-[500px] h-60 sm:h-[500px] bg-fuchsia-500/10 blur-[100px] sm:blur-[180px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-20 relative">
            <Badge className="mb-4 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30 backdrop-blur-md">
              <Target className="w-4 h-4" />
              Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 relative">
              Swap Smarter, Not Harder
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
              Just three simple steps to turn unused things into new value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 relative">
            {[
              {
                icon: Package,
                step: "Step 1",
                title: "List",
                description:
                  "Add your unused items or skills. Upload a clear photo, write a short description, and let others know what you can offer.",
              },
              {
                icon: Search,
                step: "Step 2",
                title: "Browse",
                description:
                  "Explore a wide range of items and skills shared by others—books, gadgets, fashion, or even services.",
              },
              {
                icon: RefreshCw,
                step: "Step 3",
                title: "Swap",
                description:
                  "Connect, chat, and finalize the exchange. Swapply makes swaps simple, safe, and rupee-free.",
              },
            ].map(({ icon: Icon, step, title, description }, index, arr) => (
              <div key={step} className="relative flex flex-col items-center">
                <div className="flex flex-col rounded-2xl p-6 sm:p-8 min-h-[300px] sm:min-h-[360px] bg-[#1a1a1a]/80 border border-[#c084fc]/20 shadow-[0_0_20px_rgba(192,132,252,0.15)] hover:shadow-[0_0_40px_rgba(192,132,252,0.35)] transition-all duration-500 w-full backdrop-blur-md">
                  <div className="mb-4 sm:mb-5 w-fit p-3 sm:p-4 rounded-2xl bg-[#c084fc]/10 border border-[#c084fc]/30">
                    <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-[#c084fc]" />
                  </div>

                  <div className="w-fit text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-[#c084fc]/10 text-[#c084fc] border border-[#c084fc]/30 mb-2 sm:mb-3">
                    {step}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                    {title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                    {description}
                  </p>
                </div>

                {index < arr.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-[-60px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-24 h-8 text-[#c084fc]/70 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]"
                      fill="none"
                      viewBox="0 0 100 50"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                    >
                      <path
                        d="M10,25 C40,0 60,50 90,25"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-24 bg-[#0d0d0d] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 w-72 sm:w-[700px] h-72 sm:h-[700px] bg-purple-600/20 blur-[120px] sm:blur-[200px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/3 w-60 sm:w-[500px] h-60 sm:h-[500px] bg-fuchsia-500/10 blur-[100px] sm:blur-[180px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-6 bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            Features
          </Badge>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Why Choose Swapply?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-xl sm:max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed">
            From item listings to skill sharing, Swapply offers everything you need to trade smarter, safer, and simpler.
          </p>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Users className="w-6 h-6 text-[#c084fc]" />,
                title: "Built for Everyone",
                content:
                  "Swapply is crafted for individuals, communities, and creators who believe in value beyond money. Trade items or skills with ease.",
                span: "lg:col-span-2",
              },
              {
                icon: <Package className="w-6 h-6 text-[#c084fc]" />,
                title: "Item & Skill Listings",
                content:
                  "List unused items with photos, condition, category, and even bills — or offer your skills like tech, music, art, tutoring, or fitness.",
              },
              {
                icon: <RefreshCw className="w-6 h-6 text-[#c084fc]" />,
                title: "Smart Swapping",
                content:
                  "Swap items for items, skills for skills, or mix both. Guitar lessons for a phone? Books for furniture? Done.",
              },
              {
                icon: <Shield className="w-6 h-6 text-[#c084fc]" />,
                title: "Secure Swapping",
                content:
                  "All swaps are secured with unique verification codes, ensuring both parties confirm the exchange before completion.",
              },
              {
                icon: <Bell className="w-6 h-6 text-[#c084fc]" />,
                title: "Real-Time Notifications",
                content:
                  "Stay updated on swaps, requests, and verifications with instant notifications.",
              },
            ].map(({ icon, title, content, span }, idx) => (
              <div
                key={idx}
                className={`flex flex-col rounded-3xl p-6 sm:p-8 h-full bg-[#1a1a1a]/80 border border-[#c084fc]/20 shadow-[0_0_20px_rgba(192,132,252,0.15)] hover:shadow-[0_0_40px_rgba(192,132,252,0.35)] transition-all duration-500 backdrop-blur-md ${span || ""
                  }`}
              >
                <div className="flex flex-col gap-4 sm:gap-5 text-left h-full">
                  <div className="w-fit p-3 sm:p-4 rounded-2xl bg-[#c084fc]/10 border border-[#c084fc]/30">
                    {icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">{title}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed flex-grow">{content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <div className="bg-[#0d0d0d]">
        <section className="py-20 bg-purple-500/40 text-white mx-4 md:mx-20 rounded-2xl relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
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
              Discover unique items and skills, build meaningful connections,
              and embrace a sustainable lifestyle through swapping.
            </p>
            <Link to={"/browse"}>
              <Button
                size="lg"
                className="transition-all rounded-xl flex items-center justify-center gap-x-2 px-6 py-3 w-[180px] h-[50px] text-base font-medium"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        <footer className=" text-white py-12 px-6 md:px-8 ">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <Logo />
              <p className="mt-4 text-white/80 text-sm leading-relaxed max-w-md">
                Swapply is a bartering platform. Trade items and skills directly
                with others — sneakers, gadgets, books, art, tutoring sessions,
                and more. List, browse, and swap effortlessly within a trusted
                community.
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
            © {new Date().getFullYear()} Swapply. A product by{" "}
            <a
              href="https://jemslabs.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline"
            >
              Jems Labs
            </a>
            . Developed by{" "}
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