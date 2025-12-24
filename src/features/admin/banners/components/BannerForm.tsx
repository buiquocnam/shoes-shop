"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { bannerSchema, BannerFormValues } from "../schema";
import { BannerType, BannerSlot } from "../types";
import Image from "next/image";

const BANNER_SLOTS: BannerSlot[] = ["HOME_1", "HOME_2", "HOME_3"];

interface BannerFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  banner?: BannerType;
  trigger?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BannerForm({
  onSubmit,
  isLoading,
  banner,
  trigger,
  open,
  onOpenChange,
}: BannerFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    banner?.imageUrl || null
  );

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title || "",
      link: banner?.link || "",
      slot: banner?.slot || "HOME_1",
      image: undefined,
    },
  });

  // Reset form when banner changes
  useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title,
        link: banner.link,
        slot: banner.slot,
        image: undefined,
      });
      setImagePreview(banner.imageUrl);
    } else {
      form.reset({
        title: "",
        link: "",
        slot: "HOME_1",
        image: undefined,
      });
      setImagePreview(null);
    }
  }, [banner, form]);

  const handleFormSubmit = async (data: BannerFormValues) => {
    // Schema đã validate image là bắt buộc qua refine
    // Nhưng TypeScript vẫn nghĩ nó có thể undefined, nên cần check
    if (!data.image || !(data.image instanceof File)) {
      form.setError("image", {
        type: "manual",
        message: "Vui lòng chọn hình ảnh",
      });
      return;
    }

    const formData = new FormData();

    const bannerData: {
      title: string;
      link: string;
      slot: string;
      id?: string;
    } = {
      title: data.title,
      link: data.link,
      slot: data.slot,
    };

    // Nếu có id thì thêm vào để update
    if (banner?.id) {
      bannerData.id = banner.id;
    }

    const requestBlob = new Blob([JSON.stringify(bannerData)], {
      type: "application/json",
    });
    formData.append("request", requestBlob);

    // File luôn bắt buộc
    formData.append("file", data.image);

    try {
      await onSubmit(formData);
      form.reset();
      setImagePreview(null);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    form.setValue("image", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    form.setValue("image", undefined);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {banner ? "Chỉnh sửa banner" : "Tạo banner mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề banner"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập link (ví dụ: dhttdsp://...)"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slot</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Chọn slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANNER_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Hình ảnh {banner && <span className="text-muted-foreground">(Bắt buộc chọn ảnh mới)</span>}</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                              src={imagePreview}
                              alt="Xem trước banner"
                              fill
                              unoptimized
                              priority
                              className="object-contain p-4"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-2">
                            <label
                              htmlFor="banner-upload-replace"
                              className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
                              title="Thay đổi ảnh"
                            >
                              <Upload className="h-4 w-4" />
                              <Input
                                id="banner-upload-replace"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageChange(e.target.files)}
                                {...field}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              title="Xóa ảnh"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="banner-upload"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-10 w-10 text-gray-400 mb-3" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Nhấp để tải lên
                              </span>{" "}
                              hoặc kéo thả
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF tối đa 10MB
                            </p>
                          </div>
                          <Input
                            id="banner-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e.target.files)}
                            {...field}
                          />
                        </label>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                >
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : banner ? "Cập nhật" : "Tạo"}
              </Button>
            </div>
            {isLoading && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
                <Spinner />
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

