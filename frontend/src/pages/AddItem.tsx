import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CloudUpload, Loader2, X } from "lucide-react";
import type { AddItem } from "@/lib/types";
import { useApp } from "@/stores/useApp";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@clerk/clerk-react";

export default function AddItem() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [, setImageFile] = useState<File | null>(null);
  const { addItem } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const navigate = useNavigate();
  const [data, setData] = useState<AddItem>({
    title: "",
    description: "",
    currentPrice: 0,
    originalPrice: 0,
    currencyType: "INR",
    company: "",
    category: "",
    condition: "NEW",
    hasBill: true,
    image: null,
    itemAge: 0,
  });
  const { getToken } = useAuth();



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      setImageFile(file);
      setData({ ...data, image: file });

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
    setData({ ...data, image: null });
  };


  const handleAdd = async () => {

    const token = await getToken({template: "default" })
    if (!data.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!data.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!data.currentPrice || data.currentPrice <= 0) {
      toast.error("Current Price must be greater than 0");
      return;
    }
    if (!data.originalPrice || data.originalPrice <= 0) {
      toast.error("Original Price must be greater than 0");
      return;
    }
    if (!data.currencyType) {
      toast.error("Currency Type is required");
      return;
    }
    if (!data.company.trim()) {
      toast.error("Company is required");
      return;
    }
    if (!data.category) {
      toast.error("Category is required");
      return;
    }
    if (!data.condition) {
      toast.error("Condition is required");
      return;
    }
    if (data.hasBill === null || data.hasBill === undefined) {
      toast.error("Bill status is required");
      return;
    }
    if (data.itemAge < 0) {
      toast.error("Item Age cannot be negative");
      return;
    }
    if (!data.image) {
      toast.error("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("currentPrice", data.currentPrice.toString());
    formData.append("originalPrice", data.originalPrice.toString());
    formData.append("currencyType", data.currencyType);
    formData.append("company", data.company);
    formData.append("category", data.category);
    formData.append("condition", data.condition);
    formData.append("hasBill", data.hasBill.toString());
    formData.append("itemAge", data.itemAge.toString());
    formData.append("image", data.image);

    setIsLoading(true);
    await addItem(formData, navigate, token);
    setIsLoading(false);
  };


  return (
    <div className="py-4 px-6">
      <Card className="p-6 w-full md:w-2/3 lg:w-1/2 bg-[#0a0a0a] border border-[#2a2a2a] mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white text-center tracking-tight mb-2 flex gap-3 justify-center">
            List an Item
          </h1>
          <p className="text-center text-muted-foreground text-sm">
            Fill out the details to add your item
          </p>
        </div>
        <div className="flex space-x-6 border-b border-gray-700">
          {[1, 2].map((tabNumber) => (
            <button
              key={tabNumber}
              onClick={() => setStep(tabNumber)}
              className={`px-4 py-2 font-semibold cursor-pointer ${step === tabNumber
                ? "border-b-2 border-purple-500 text-white"
                : "text-gray-500 hover:text-gray-300"
                }`}
              aria-selected={step === tabNumber}
              role="tab"
            >
              {tabNumber === 1 ? "Basic Info" : "Pricing & Details"}
            </button>
          ))}
        </div>
        {step === 1 && (
          <div className="space-y-4" role="tabpanel" aria-labelledby="tab1">
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
              />
              <div className="flex items-center gap-4">
                <Button type="button" onClick={() => imageInputRef.current?.click()} variant="outline">
                  <CloudUpload size={16} />
                  <span>Upload Image</span>
                </Button>
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-md object-cover border" />
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
              <p className="text-xs text-muted-foreground pl-1">
                * Upload a clear, well-lit image (PNG or JPEG only).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Wireless Bluetooth Headphones"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Gently used over-ear wireless headphones with noise cancellation and 30-hour battery life."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4" role="tabpanel" aria-labelledby="tab2">
            <div className="flex gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="currentPrice">Current Price</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  value={data.currentPrice}
                  onChange={(e) => setData({ ...data, currentPrice: Number(e.target.value) })}
                  inputMode="decimal"
                  placeholder="2999"
                />
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={data.originalPrice}
                  onChange={(e) => setData({ ...data, originalPrice: Number(e.target.value) })}
                  step="1"
                  min="0"
                  inputMode="decimal"
                  placeholder="4999"

                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currencyType">Currency Type</Label>
              <Select
                value={data.currencyType}
                onValueChange={(value) => setData({ ...data, currencyType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currency</SelectLabel>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 justify-between">
              <div className="space-y-2 w-full">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={data.company}
                  onChange={(e) => setData({ ...data, company: e.target.value })}
                  placeholder="Sony"
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={data.category}
                  onValueChange={(value) => setData({ ...data, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {categories.map((c, i) => (
                        <SelectItem key={i} value={c.value}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={data.condition}
                  onValueChange={(value) => setData({ ...data, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Condition</SelectLabel>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="LIKE_NEW">Like New</SelectItem>
                      <SelectItem value="USED">Used</SelectItem>
                      <SelectItem value="DAMAGED">Damaged</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemAge">Item Age (months)</Label>
              <Input
                id="itemAge"
                type="number"
                min="0"
                value={data.itemAge}
                onChange={(e) =>
                  setData({ ...data, itemAge: e.target.value ? Number(e.target.value.replace(/\D/g, "")) : 0 })
                }
                placeholder="e.g. 2"
              />
              <p className="text-xs text-muted-foreground pl-1">
                * Please specify the age of the item in months, for example: 1, 2, or 12
              </p>
            </div>
            <div className="flex  items-center justify-between">
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="hasBill"
                  checked={data.hasBill}
                  onCheckedChange={(checked) =>
                    setData({ ...data, hasBill: checked })
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="hasBill">Has Bill</Label>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-6">
          {step === totalSteps && (
            <Button onClick={handleAdd} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Add Item
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
