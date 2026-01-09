"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from "@/components/ui/field";
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
import { Banner } from "@/types/banner";
import Image from "next/image";

const BANNER_SLOTS = {
  HOME_HERO: "HOME_HERO",
  HOME_MID: "HOME_MID",
};

interface BannerFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  banner?: Banner;
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
    banner?.url || null
  );

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title || "",
      link: banner?.link || "",
      slot: (banner?.type as "HOME_HERO" | "HOME_MID") || "HOME_HERO",
      image: undefined,
    },
  });

  useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title,
        link: banner.link,
        slot: banner.type as "HOME_HERO" | "HOME_MID",
        image: undefined,
      });
      setImagePreview(banner.url);
    } else {
      form.reset({
        title: "",
        link: "",
        slot: "HOME_HERO",
        image: undefined,
      });
      setImagePreview(null);
    }
  }, [banner, form]);

  const handleFormSubmit = async (data: BannerFormValues) => {
    if (!data.image && !banner) {
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

    if (banner?.id) {
      bannerData.id = banner.id;
    }

    const requestBlob = new Blob([JSON.stringify(bannerData)], {
      type: "application/json",
    });
    formData.append("request", requestBlob);

    if (data.image) {
      formData.append("file", data.image);
    }

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

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="banner-title">Tiêu đề</FieldLabel>
              <Input
                id="banner-title"
                placeholder="Nhập tiêu đề banner"
                {...form.register("title")}
                className="h-11"
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.link}>
              <FieldLabel htmlFor="banner-link">Link</FieldLabel>
              <Input
                id="banner-link"
                placeholder="Nhập link (ví dụ: dhttdsp://...)"
                {...form.register("link")}
                className="h-11"
              />
              <FieldError errors={[form.formState.errors.link]} />
            </Field>

            <Controller
              control={form.control}
              name="slot"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="banner-slot">Slot hiển thị</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger id="banner-slot" className="h-11">
                      <SelectValue placeholder="Chọn slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BANNER_SLOTS).map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="banner-image">Hình ảnh {banner && <span className="text-muted-foreground text-xs">(Chọn ảnh mới nếu cần thay đổi)</span>}</FieldLabel>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden bg-muted/30">
                        <Image
                          src={imagePreview}
                          alt="Xem trước banner"
                          fill
                          unoptimized
                          className="object-contain p-4"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <label
                            htmlFor="banner-upload-replace"
                            className="p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
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
                            className="p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                            title="Xóa ảnh"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="banner-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30 transition-colors bg-muted/10 border-muted-foreground/20"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                          <p className="mb-1 text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Nhấp để tải lên</span> hoặc kéo thả
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF tối đa 10MB</p>
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
                  <FieldError errors={[fieldState.error]} />
                </Field>
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
              <Button type="submit" disabled={isLoading} className="font-bold">
                {isLoading ? "Đang lưu..." : banner ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </FieldGroup>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-50">
              <Spinner className="h-8 w-8" />
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
