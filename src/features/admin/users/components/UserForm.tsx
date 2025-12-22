"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/form/InputField";
import { CustomField } from "@/components/form/CustomField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { userSchema, UserFormValues } from "../schema";
import { User } from "@/types/global";

interface UserFormProps {
    onSubmit: (data: { id: string; name: string; phone?: string; status?: boolean }) => void;
    isLoading?: boolean;
    user?: User;
    trigger?: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserForm({
    onSubmit,
    isLoading,
    user,
    trigger,
    open,
    onOpenChange,
}: UserFormProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            status: user?.status || false,
        },
    });

    const handleFormSubmit = async (data: UserFormValues) => {
        try {
            await onSubmit({
                id: user!.id,
                name: data.name,
                phone: data.phone || "",
                status: data.status,
            });
            form.reset();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {user ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                        <InputField
                            control={form.control}
                            name="name"
                            label="Tên"
                            placeholder="Nhập tên"
                        />

                        <InputField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Nhập email"
                            disabled={true}
                        />

                        <InputField
                            control={form.control}
                            name="phone"
                            label="Điện thoại"
                            placeholder="Nhập số điện thoại"
                        />

                        <CustomField
                            control={form.control}
                            name="status"
                            render={(field, fieldState) => (
                                <div className="flex items-start space-x-3 rounded-md border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 transition-colors">
                                    <Checkbox
                                        id="status"
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(!!checked);
                                        }}
                                        className="mt-0.5"
                                    />
                                    <div className="space-y-1 leading-none flex-1">
                                        <Label
                                            htmlFor="status"
                                            className="font-medium cursor-pointer text-sm text-gray-900 dark:text-gray-100"
                                        >
                                            Trạng thái hoạt động
                                        </Label>
                                      
                                    </div>
                                </div>
                            )}
                        />

                        <div className="flex justify-end gap-3">
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
                                {isLoading ? (
                                    <>
                                        <Spinner className="mr-2 h-4 w-4" />
                                        Đang lưu...
                                    </>
                                ) : user ? (
                                    "Cập nhật"
                                ) : (
                                    "Tạo"
                                )}
                            </Button>
                        </div>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-50">
                                <Spinner className="h-8 w-8" />
                            </div>
                        )}
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

