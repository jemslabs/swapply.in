import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/stores/useApp";
import { ArrowLeft, CloudUpload, Loader2, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function CreateCircle() {
  const [data, setData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });
  const navigate = useNavigate()
  const { createCircle } = useApp();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const formData = new FormData();
    if (!data.name || !data.description || !data.image) {
      toast.error("Name, Description and logo is required");
      return;
    }
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("image", data.image);
    await createCircle(formData);
    setIsLoading(false);
  };
  return (
    <div className="py-4 px-10">
      <Button variant={"outline"} onClick={() => navigate(-1)}>
        <ArrowLeft />
        Go Back
      </Button>
      <Card className="p-6 w-1/2 space-y-4 bg-[#000000] border border-[#2a2a2a] mx-auto">
        <h1 className="text-3xl font-bold text-white text-center tracking-tight">
          Create New Circle
        </h1>
        <Separator />
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
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Describe what this circle is about, who it's for, and what members can expect."
          />
        </div>
        <Button disabled={isLoading} onClick={handleSubmit}>
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
  );
}

export default CreateCircle;
