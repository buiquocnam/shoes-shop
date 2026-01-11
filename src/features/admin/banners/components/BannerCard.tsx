"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, ImagePlus, CheckCircle2 } from "lucide-react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { bannerSchema, BannerFormValues } from "../schema";
import { Banner, BannerSlot } from "@/types/banner";

interface BannerCardProps {
  banner?: Banner;
  slot: BannerSlot;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export default function BannerCard({
  banner,
  slot,
  onSubmit,
  isLoading,
}: BannerCardProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    banner?.imageUrl || null
  );

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title ?? "",
      link: banner?.link ?? "",
      slot: slot,
      image: undefined,
      active: banner?.active ?? true,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = form;

  // Sync with banner changes (important when a new banner is created or updated)
  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title,
        link: banner.link,
        slot: banner.slot,
        active: banner.active,
        image: undefined,
      });
      setImagePreview(banner.imageUrl);
    }
  }, [banner, reset]);

  const handleFormSubmit = async (data: BannerFormValues) => {
    // Required image ONLY when creating new banner
    if (!data.image && !banner) {
      setError("image", {
        type: "manual",
        message: "Vui lòng chọn hình ảnh",
      });
      return;
    }

    const formData = new FormData();
    const bannerData: Partial<Banner> = {
      title: data.title,
      link: data.link,
      slot: slot,
      active: data.active,
    };

    if (banner?.id) {
      bannerData.id = banner.id;
    }
    console.log(bannerData);
    formData.append(
      "request",
      new Blob([JSON.stringify(bannerData)], {
        type: "application/json",
      })
    );

    if (data.image) {
      formData.append("file", data.image);
    }

    try {
      await onSubmit(formData);
      // Optional: clear file selection after success if it was a file upload
      if (data.image) {
        setValue("image", undefined);
      }
    } catch (error) {
      console.error("Submit banner error:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("image", file, { shouldValidate: true });
    clearErrors("image");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setValue("image", undefined, { shouldValidate: true });
    setImagePreview(banner?.imageUrl || null);
  };

  const onInvalid = (errors: any) => {
    console.error("Banner Form Validation Errors:", errors);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 border-muted-foreground/10 flex flex-col h-full",
      isLoading && "opacity-60 grayscale-[0.2]",
      !banner && "border-dashed border-2 bg-muted/20"
    )}>
      <CardHeader className="pb-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold">
                {slot.replace("HOME_", "").replace("_", " ")}
              </CardTitle>
              {banner?.active && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
            </div>
            <CardDescription className="text-xs uppercase font-medium tracking-tight opacity-70">
              Vị trí: {slot}
            </CardDescription>
          </div>

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <div className="flex flex-col items-end gap-1.5">
                <Switch
                  checked={field.value}
                  disabled={isLoading}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (banner) {
                      handleSubmit(handleFormSubmit, onInvalid)();
                    }
                  }}
                />
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  field.value ? "text-primary" : "text-muted-foreground"
                )}>
                  {field.value ? "Hiển thị" : "Đã ẩn"}
                </span>
              </div>
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <form
          onSubmit={handleSubmit(handleFormSubmit, onInvalid)}
          className="space-y-6 flex-1 flex flex-col"
        >
          {/* IMAGE PREVIEW & UPLOAD */}
          <div className="space-y-3">
            <Field data-invalid={!!errors.image}>
              <div className={cn(
                "relative aspect-[16/9] w-full overflow-hidden rounded-xl border-2 transition-all group",
                imagePreview ? "border-muted/30" : "border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10"
              )}>
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Banner Preview"
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-3">
                      <label className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-xl ring-offset-2 ring-primary/20 hover:scale-110 active:scale-95 transition-all">
                        <Upload className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-xl hover:scale-110 active:scale-95 transition-all"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Badge if new image selected */}
                    {form.getValues("image") && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-[10px] font-bold text-primary-foreground rounded-md shadow-sm">
                        ẢNH MỚI
                      </div>
                    )}
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 p-6">
                    <div className="p-4 rounded-full bg-primary/10 text-primary animate-pulse">
                      <ImagePlus className="h-8 w-8" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold text-primary italic">Nhấp để tải ảnh lên</p>
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
                        Khuyên dùng tỷ lệ 16:9 cho vị trí này
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[4px] z-10 font-bold italic tracking-widest text-primary animate-pulse">
                    <Spinner className="mr-2 h-6 w-6" />
                    ĐANG XỬ LÝ...
                  </div>
                )}
              </div>
              <FieldError errors={[errors.image]} />
            </Field>
          </div>

          <div className="grid gap-5">
            {/* TITLE */}
            <Field data-invalid={!!errors.title}>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Tiêu đề quảng bá</FieldLabel>
              <Input
                {...register("title")}
                placeholder="Nhập slogan hoặc tiêu đề..."
                disabled={isLoading}
                className="h-11 border-muted-foreground/20 bg-muted/30 transition-all focus-visible:ring-primary/20 focus-visible:bg-background"
              />
              <FieldError errors={[errors.title]} />
            </Field>

            {/* LINK */}
            <Field data-invalid={!!errors.link}>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Đường dẫn hành động (CTA)</FieldLabel>
              <Input
                {...register("link")}
                placeholder="https://myshop.com/promo-sale"
                disabled={isLoading}
                className="h-11 border-muted-foreground/20 bg-muted/30 transition-all focus-visible:ring-primary/20 focus-visible:bg-background"
              />
              <FieldError errors={[errors.link]} />
            </Field>
          </div>

          <div className="mt-auto pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-12 font-bold text-sm uppercase tracking-widest shadow-lg transition-all active:scale-[0.97]",
                !banner ? "bg-primary hover:bg-primary/90" : "bg-neutral-800 hover:bg-black dark:bg-neutral-700"
              )}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Gửi dữ liệu...
                </>
              ) : (
                banner ? "Cập nhật dữ liệu" : "Thiết lập Banner"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
