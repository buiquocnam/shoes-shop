"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/form/InputField";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateUser, useDeleteUser } from "../hooks";
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
    isLoading?: boolean;
    user?: User;
    trigger?: React.ReactNode;
}

export function UserForm({
    isLoading,
    user,
    trigger,
}: UserFormProps) {
    const [open, setOpen] = useState(false);
    const updateUserMutation = useUpdateUser();

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
            await updateUserMutation.mutateAsync({
                id: user!.id,
                name: data.name,
                phone: data.phone || "",
                status: data.status,
            });
            form.reset();
            setOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Add User</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {user ? "Edit User" : "Create New User"}
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                        <InputField
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Enter name"
                            className="h-11"
                        />

                        <InputField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Enter email"
                            className="h-11"
                            disabled={true}
                        />

                        <InputField
                            control={form.control}
                            name="phone"
                            label="Phone"
                            placeholder="Enter phone"
                            className="h-11"
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
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : user ? "Update" : "Create"}
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

