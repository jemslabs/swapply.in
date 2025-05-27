import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Separator } from "@/components/ui/separator";

function AddItem() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [, setImageFile] = useState<File | null>(null);
  const { addItem } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
  });

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


  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setData({ ...data, company: e.target.value })
  }

  const handleAdd = async () => {
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


    if (data.image) {
      formData.append("image", data.image);
    } else {
      toast.error("Image is required")
      return;
    }


    setIsLoading(true)
    await addItem(formData)
    setIsLoading(false)
  }
  return (
    <div className="py-4 px-6">

      <Card className="p-6 w-1/2 space-y-1 bg-[#000000] border border-[#2a2a2a] mx-auto">
        <h1 className="text-3xl font-bold text-white text-center tracking-tight">
          Add a New Item
        </h1>
        <Separator />
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
            <Button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              variant={"outline"}
            >
              <CloudUpload size={16} />
              <span>Upload Image</span>
            </Button>
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Item Preview"
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
            onChange={(e) =>
              setData({ ...data, description: e.target.value })
            }
            placeholder="Gently used over-ear wireless headphones with noise cancellation and 30-hour battery life."
          />
        </div>

        <div className="flex gap-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="currentPrice">Current Price</Label>
            <Input
              id="currentPrice"
              type="number"
              value={data.currentPrice}
              onChange={(e) =>
                setData({ ...data, currentPrice: Number(e.target.value) })
              }
              step="1"
              min="0"
              inputMode="decimal"
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
              }}
              placeholder="2999"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="originalPrice">Original Price</Label>
            <Input
              id="originalPrice"
              type="number"
              value={data.originalPrice}
              onChange={(e) =>
                setData({ ...data, originalPrice: Number(e.target.value) })
              }
              step="0.01"
              min="0"
              inputMode="decimal"
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
              }}
              placeholder="4999"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="currencyType">Currency Type</Label>
            <Select
              value={data?.currencyType}
              onValueChange={(value: string) =>
                setData({ ...data, currencyType: value })
              }
            >
              <SelectTrigger className="w-[180px]">
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
        </div>
        <div className="flex gap-4 justify-between">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={data.company}
              onChange={handleCompanyChange}
              placeholder="Sony"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={data?.category}
              onValueChange={(value: string) =>
                setData({ ...data, category: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {categories.map((category, index) => {
                    return (
                      <SelectItem value={category.value} key={index}>
                        {category.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={data?.condition}
              onValueChange={(value: string) =>
                setData({ ...data, condition: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a condition" />
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



        <Button disabled={isLoading} onClick={handleAdd}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            "Add"
          )}
        </Button>
      </Card>
    </div>
  );
}

export default AddItem;
