import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/stores/useApp";
import { useAuth } from "@/stores/useAuth";
import { ArrowLeft, ArrowUpRight, CloudUpload, Loader2, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth as useClerkAuth } from '@clerk/clerk-react'
function CreateCircle() {
  const [data, setData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    isPrivate: false,
  });

  const navigate = useNavigate();
  const { createCircle } = useApp();
  const { user } = useAuth();
  const isPro = !!user?.plan;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImagePreview = () => {
    setData({ ...data, image: null });
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const { getToken } = useClerkAuth();
    const token = await getToken({template: "default" });
    setIsLoading(true);
    try {
      if (!data.name) {
        toast.error("Name is required");
        return;
      }
      if (!data.description) {
        toast.error("Description is required");
        return;
      }
      if (!data.image) {
        toast.error("Image is required");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("image", data.image);
      formData.append("isPrivate", String(data.isPrivate));

      await createCircle(formData, navigate, token);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyToggle = (value: boolean) => {
    if (value && !isPro) {

      setShowUpgradePrompt(true);
      setData((prev) => ({ ...prev, isPrivate: false }));
    } else {
      setShowUpgradePrompt(false);
      setData((prev) => ({ ...prev, isPrivate: value }));
    }
  };

  const handleUpgradeClick = () => {
    navigate("/pricing");
  };

  return (
    <div className="py-4 px-10">
      <div className="w-1/2 space-y-4 mx-auto">
        <Card className="p-6 bg-[#0a0a0a] border border-[#2a2a2a] mx-auto">
          <div className="flex items-center justify-center gap-5">
            <Button variant={"outline"} onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="text-3xl font-bold text-white text-center tracking-tight">
              Create New Circle
            </h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Logo</Label>
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}
            />
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                variant={"outline"}
              >
                <CloudUpload size={16} className="mr-2" />
                <span>Upload Image</span>
              </Button>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Circle Preview"
                    className="w-16 h-16 rounded-md object-cover border"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                    onClick={clearImagePreview}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 pl-1">
              * Upload a clear, well-lit logo or image for your circle (PNG or
              JPEG only).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Circle Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="e.g. Indie Hackers India"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Circle Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              placeholder="Describe what this circle is about, who it's for, and what members can expect."
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Label htmlFor="isPrivate">
                {data.isPrivate ? "Private" : "Public"}
              </Label>
              <Switch
                id="isPrivate"
                checked={data.isPrivate}
                onCheckedChange={handlePrivacyToggle}
                className="cursor-pointer"
              />
            </div>
            {showUpgradePrompt && (
              <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-[#c084fc]/10 bg-[#c084fc]/20 px-4 py-3 text-purple-100 shadow-inner backdrop-blur-md">
                <div className="flex flex-col">
                  <p className="text-lg font-medium">
                    Upgrade to <strong>Pro</strong>
                  </p>
                  <p className="text-xs leading-snug text-purple-200">
                    to enable private circles and unlock more exclusive features.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleUpgradeClick}
                  variant={"ghost"}
                >
                  Upgrade <ArrowUpRight size={14} />
                </Button>
              </div>
            )}

          </div>

          <Button disabled={isLoading} onClick={handleSubmit} className="mt-6 w-30">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Create"
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default CreateCircle;
