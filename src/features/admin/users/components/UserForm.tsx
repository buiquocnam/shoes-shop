"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/form/InputField";
import { Checkbox } from "@/components/ui/checkbox";
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

                        <Checkbox
                            id="status"
                            checked={form.watch("status")}
                            onCheckedChange={(checked) => form.setValue("status", !!checked)}
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
                                {isLoading ? "Đang lưu..." : user ? "Cập nhật" : "Tạo"}
                            </Button>
                        </div>
                        {isLoading &&
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
                                <Spinner />
                            </div>
                        }
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

