"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, RefreshCw, Calendar, Percent, DollarSign, Users, Power } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { InputField, NumberField, CustomField } from "@/components/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { couponSchema, CouponFormValues } from "../schema";
import { Coupon } from "../types";
import { useSaveCoupon } from "../hooks/useSaveCoupon";

interface CouponFormProps {
  coupon?: Coupon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CouponForm({
  coupon,
  open,
  onOpenChange,
}: CouponFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const saveCoupon = useSaveCoupon();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || "",
      discountPercent: coupon?.discountPercent || 0,
      minOrder: coupon?.minOrder || 0,
      quantity: coupon?.quantity || undefined,
      expirationDate: coupon?.expirationDate
        ? new Date(coupon.expirationDate).toISOString().split("T")[0]
        : "",
      active: coupon?.active ?? true,
    },
  });

  // Reset form when coupon changes
  useEffect(() => {
    if (coupon) {
      form.reset({
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        minOrder: coupon.minOrder,
        quantity: coupon.quantity,
        expirationDate: new Date(coupon.expirationDate).toISOString().split("T")[0],
        active: coupon.active,
      });
    } else {
      form.reset({
        code: "",
        discountPercent: 0,
        minOrder: 0,
        quantity: undefined,
        expirationDate: "",
        active: true,
      });
    }
  }, [coupon, form]);

  const generateCode = () => {
    setIsGenerating(true);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("code", code);
    setIsGenerating(false);
  };

  const onSubmit = async (data: CouponFormValues) => {
    try {
      // Convert date to ISO string
      const expirationDate = new Date(data.expirationDate).toISOString();

      await saveCoupon.mutateAsync({
        id: coupon?.id,
        code: data.code,
        discountPercent: data.discountPercent,
        minOrder: data.minOrder,
        quantity: data.quantity || 100,
        expirationDate,
        active: data.active,
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col">
            <DialogTitle className="text-xl font-bold tracking-tight text-gray-900">
              {coupon ? "Cập nhật mã giảm giá" : "Tạo mã giảm giá"}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              {coupon ? "Chỉnh sửa thông tin mã giảm giá" : "Tạo mã giảm giá mới cho cửa hàng"}
            </p>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 space-y-6">
          {/* Coupon Code */}
          <CustomField
            control={form.control}
            name="code"
            label="Mã giảm giá"
            className="flex flex-col gap-2"
            render={(field, fieldState) => (
              <>
                <div className="relative flex items-center">
                  <Input
                    className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 px-4 pr-12 text-base text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="VD: SUMMER2024"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    disabled={isGenerating}
                    className="absolute right-2 p-2 text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-white"
                    title="Tự động tạo mã"
                  >
                    {isGenerating ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <RefreshCw className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Khách hàng sẽ nhập mã này khi thanh toán.
                </p>
              </>
            )}
          />

          {/* Discount & Expiration Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Discount Percentage */}
            <CustomField
              control={form.control}
              name="discountPercent"
              label="Giá trị giảm giá"
              className="flex flex-col gap-2"
              render={(field) => (
                <div className="relative flex items-center">
                  <Percent className="absolute left-4 h-5 w-5 text-gray-500" />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="20"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              )}
            />

            {/* Expiration Date */}
            <CustomField
              control={form.control}
              name="expirationDate"
              label="Ngày hết hạn"
              className="flex flex-col gap-2"
              render={(field) => (
                <div className="relative flex items-center cursor-pointer group">
                  <Calendar className="absolute right-3 h-5 w-5 text-gray-500 group-hover:text-primary transition-colors pointer-events-none" />
                  <Input
                    type="date"
                    className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 px-4 pr-10 text-base text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-pointer"
                    {...field}
                  />
                </div>
              )}
            />
          </div>

          {/* Min Order & Usage Limit Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Min Order Value */}
            <CustomField
              control={form.control}
              name="minOrder"
              label="Giá trị đơn hàng tối thiểu"
              className="flex flex-col gap-2"
              render={(field) => (
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-4 h-5 w-5 text-gray-500" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              )}
            />

            {/* Usage Limit */}
            <CustomField
              control={form.control}
              name="quantity"
              label="Giới hạn sử dụng"
              className="flex flex-col gap-2"
              render={(field) => (
                <div className="relative flex items-center">
                  <Users className="absolute left-4 h-5 w-5 text-gray-500" />
                  <Input
                    type="number"
                    min="1"
                    className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="Không giới hạn"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              )}
            />
          </div>

          <hr className="border-gray-200 border-dashed" />

          {/* Active Toggle */}
          <CustomField
            control={form.control}
            name="active"
            className="flex flex-col gap-2"
            render={(field) => (
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                    <Power className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">Trạng thái hoạt động</span>
                    <span className="text-xs text-gray-500">Kích hoạt mã giảm giá ngay sau khi tạo</span>
                  </div>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mr-2"
                />
              </div>
            )}
          />

            {/* Footer Actions */}
            <div className="px-0 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-xl -mx-6 -mb-6">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="px-6 h-12 rounded-lg "
                >
                  Hủy
                </Button>
              </DialogClose>
              <Button
                disabled={saveCoupon.isPending}
                className="px-6 h-12 rounded-lg "
              >
                {saveCoupon.isPending ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span className="text-lg">✓</span>
                    Lưu mã giảm giá
                  </>
                )}
              </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

