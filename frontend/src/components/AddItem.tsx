import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ChevronLeft, ImagePlus, Loader2 } from "lucide-react";

import type { AddItemType } from "@/lib/types";
import { categories, conditions } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useApp } from "@/stores/useApp";
import { toast } from "sonner";
import type { CheckedState } from "@radix-ui/react-checkbox";

function AddItem() {
  const [formData, setFormData] = useState<AddItemType>({
    title: "",
    price: 0,
    category: "",
    condition: "",
    hasBill: false,
    image: null,
    lookingFor: "",
    location: "",
  });
  const { getToken } = useAuth();
  const { addItem } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (city || state) {
      const combinedLocation = [city, state].filter(Boolean).join(", ");
      setFormData((prev) => ({ ...prev, location: combinedLocation }));
    }
  }, [city, state]);

  const handleChange = <K extends keyof AddItemType>(
    key: K,
    value: AddItemType[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const handleImageUpload = (file: File | null) => {
    handleChange("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    const token = await getToken({ template: "default" })
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }
    if (!formData.condition) {
      toast.error("Condition is required");
      return;
    }
    if (formData.hasBill === null || formData.hasBill === undefined) {
      toast.error("Bill status is required");
      return;
    }
    if (!formData.image) {
      toast.error("Image is required");
      return;
    }
    setIsLoading(true)
    const data = new FormData();
    data.append("title", formData.title)
    data.append("image", formData.image)
    data.append("category", formData.category)
    data.append("condition", formData.condition)
    data.append("hasBill", formData.hasBill.toString())
    data.append("location", formData.location)
    data.append("lookingFor", formData.lookingFor)
    data.append("price", formData.price.toString())
    await addItem(data, navigate, token);
    setIsLoading(false)

  };

  return (
    <div className="flex-col justify-center items-center min-h-screen">
      <div className="flex justify-between w-full max-w-2xl mx-auto my-3">
        <div className="flex gap-4 items-center">
          <Button variant={"outline"} onClick={() => navigate(-1)}><ChevronLeft /></Button>
          <h1 className="text-xl font-semibold">Add New Item</h1>
        </div>
        <Button className="flex items-center gap-2" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Add Item
        </Button>
      </div>
      <Card className="w-full max-w-2xl bg-[#2a202d]/70 backdrop-blur-md border border-[#3a2f43] rounded-2xl shadow-xl mx-auto">

        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
            />
            <Button
              variant="outline"
              type="button"
              className="flex gap-2 items-center w-fit bg-accent"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={18} />
              Upload Image
            </Button>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-md border border-white"
              />
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 w-1/2">
              <Label className="text-white">Title</Label>
              <Input
                placeholder="e.g. iPhone 13"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2 w-1/2">
              <Label className="text-white">Price</Label>
              <Input
                type="text"
                placeholder="e.g. 15000"
                value={formData.price}
                onChange={(e) =>
                  handleChange("price", parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 w-1/2">
              <Label className="text-white">Category</Label>
              <Select onValueChange={(val) => handleChange("category", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-1/2">
              <Label className="text-white">Condition</Label>
              <Select onValueChange={(val) => handleChange("condition", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="bill"
              checked={formData.hasBill}
              onCheckedChange={(checked: CheckedState) =>
                handleChange("hasBill", !!checked)
              }
            />
            <Label htmlFor="bill" className="text-white">
              Do you have the bill?
            </Label>
          </div>
          <div className="space-y-2">
            <Label className="text-white">What are you looking in return?</Label>
            <Textarea
              placeholder="e.g. looking to swap with headphones"
              value={formData.lookingFor}
              onChange={(e) => handleChange("lookingFor", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">State</Label>
              <Input
                placeholder="e.g. Punjab"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">City</Label>
              <Input
                placeholder="e.g. Mohali"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default AddItem;