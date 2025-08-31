import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Brain, ChevronRight, ArrowLeft } from "lucide-react";
import AddItem from "@/components/AddItem";
import AddSkill from "@/components/AddSkill";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ListPage() {
  const [listingType, setListingType] = useState<"item" | "skill" | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const options = [
    {
      label: "Physical Item",
      description: "Gadgets, books, clothes, collectibles, and more.",
      icon: <Package className="h-7 w-7 text-black" />,
      type: "item" as const,
    },
    {
      label: "Skill / Service",
      description: "Coding, design, music, language lessons, and more.",
      icon: <Brain className="h-7 w-7 text-black" />,
      type: "skill" as const,
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 flex flex-col items-center justify-start">
      {!showForm && (
        <>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 text-center flex gap-3 "
          >
            <Button variant="outline" onClick={() => navigate(-1)} size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-2">What do you want to list?</h1>
            <p className="text-muted-foreground text-sm">
              Choose what you want to offer for swapping.
            </p>
            </div>
          </motion.div>

          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            {options.map((option) => (
              <motion.div
                key={option.type}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setListingType(option.type)}
                className="cursor-pointer"
              >
                <Card
                  className={`transition-all duration-300 border-2 p-6 bg-[#2a202d]/70 backdrop-blur-md rounded-2xl shadow-lg ${listingType === option.type
                    ? "border-purple-400 bg-purple-400/10"
                    : "border-white/10 hover:border-white/20"
                    }`}
                >
                  <CardContent className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 bg-[#c084fc] rounded-full flex items-center justify-center shadow-md">
                      {option.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {listingType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mt-10"
              >
                <Button
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full mt-10 max-w-4xl px-2 sm:px-0"
        >
          {listingType === "item" && <AddItem />}
          {listingType === "skill" && <AddSkill />}
        </motion.div>
      )}
    </div>
  );
}
