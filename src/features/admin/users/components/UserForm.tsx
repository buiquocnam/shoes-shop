"use client";

import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/components/ui/field";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { userSchema, UserFormValues } from "../schema";
import { User } from "@/types";

interface UserFormProps {
    onSubmit: (data: Partial<User> & { id: string }) => void;
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
            status: user?.status || false,
        },
    });

    const handleFormSubmit = async (data: UserFormValues) => {
        if (!user) return;

        try {
            await onSubmit({
                id: user.id,
                ...data,
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

                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <FieldGroup>
                        <Field data-invalid={!!form.formState.errors.name}>
                            <FieldLabel htmlFor="user-name">Tên</FieldLabel>
                            <Input id="user-name" placeholder="Nhập tên" {...form.register("name")} />
                            <FieldError errors={[form.formState.errors.name]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="user-email">Email</FieldLabel>
                            <Input
                                id="user-email"
                                value={user?.email || ""}
                                disabled={true}
                                readOnly
                            />
                        </Field>



                        <Controller
                            control={form.control}
                            name="status"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                    <Checkbox
                                        id="user-status"
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(!!checked);
                                        }}
                                    />
                                    <FieldContent>
                                        <FieldLabel htmlFor="user-status" className="font-medium cursor-pointer">
                                            Trạng thái hoạt động
                                        </FieldLabel>
                                    </FieldContent>
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
