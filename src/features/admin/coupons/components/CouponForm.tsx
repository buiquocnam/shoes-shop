import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Calendar, Percent, DollarSign, Users, Power } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent, FieldDescription } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { couponSchema, CouponFormValues } from "../schema";
import { Coupon } from "@/types/coupon";
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
        <DialogHeader className="px-6 py-5 border-b">
          <div className="flex flex-col">
            <DialogTitle className="text-xl font-bold tracking-tight">
              {coupon ? "Cập nhật mã giảm giá" : "Tạo mã giảm giá"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {coupon ? "Chỉnh sửa thông tin mã giảm giá" : "Tạo mã giảm giá mới cho cửa hàng"}
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pt-6">
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.code}>
              <FieldLabel htmlFor="coupon-code">Mã giảm giá</FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="coupon-code"
                  className="pr-12 h-12"
                  placeholder="VD: SUMMER2024"
                  {...form.register("code")}
                />
                <button
                  type="button"
                  onClick={generateCode}
                  disabled={isGenerating}
                  className="absolute right-2 p-2 text-primary hover:text-primary/80 transition-colors rounded-lg"
                  title="Tự động tạo mã"
                >
                  {isGenerating ? <Spinner className="h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
                </button>
              </div>
              <FieldDescription>Khách hàng sẽ nhập mã này khi thanh toán.</FieldDescription>
              <FieldError errors={[form.formState.errors.code]} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field data-invalid={!!form.formState.errors.discountPercent}>
                <FieldLabel htmlFor="discount-percent">Giá trị giảm (%)</FieldLabel>
                <div className="relative flex items-center">
                  <Percent className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="discount-percent"
                    type="number"
                    className="pl-10 h-12"
                    placeholder="20"
                    {...form.register("discountPercent", { valueAsNumber: true })}
                  />
                </div>
                <FieldError errors={[form.formState.errors.discountPercent]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.expirationDate}>
                <FieldLabel htmlFor="expiration-date">Ngày hết hạn</FieldLabel>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="expiration-date"
                    type="date"
                    className="pl-10 h-12"
                    {...form.register("expirationDate")}
                  />
                </div>
                <FieldError errors={[form.formState.errors.expirationDate]} />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field data-invalid={!!form.formState.errors.minOrder}>
                <FieldLabel htmlFor="min-order">Đơn hàng tối thiểu</FieldLabel>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="min-order"
                    type="number"
                    className="pl-10 h-12"
                    placeholder="0"
                    {...form.register("minOrder", { valueAsNumber: true })}
                  />
                </div>
                <FieldError errors={[form.formState.errors.minOrder]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.quantity}>
                <FieldLabel htmlFor="quantity">Giới hạn sử dụng</FieldLabel>
                <div className="relative flex items-center">
                  <Users className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="quantity"
                    type="number"
                    className="pl-10 h-12"
                    placeholder="Không giới hạn"
                    {...form.register("quantity", { valueAsNumber: true })}
                  />
                </div>
                <FieldError errors={[form.formState.errors.quantity]} />
              </Field>
            </div>

            <Controller
              control={form.control}
              name="active"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation="horizontal" className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                      <Power className="h-6 w-6" />
                    </div>
                    <FieldContent>
                      <FieldLabel className="font-bold">Trạng thái hoạt động</FieldLabel>
                      <FieldDescription>Kích hoạt mã giảm giá ngay sau khi tạo</FieldDescription>
                    </FieldContent>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="flex justify-end gap-3 pt-6 pb-6 mt-4 border-t sticky bottom-0 bg-background -mx-6 px-6">
              <DialogClose asChild>
                <Button variant="outline" className="h-11 px-6">Hủy</Button>
              </DialogClose>
              <Button disabled={saveCoupon.isPending} className="h-11 px-8 font-bold">
                {saveCoupon.isPending ? <Spinner className="h-4 w-4" /> : "Lưu mã giảm giá"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
