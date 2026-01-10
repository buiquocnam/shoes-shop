"use client";

import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmAlertProps {
    onConfirm: () => void;
    children?: React.ReactNode;
    itemName?: string;
    title?: string;
    description?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ConfirmAlert({
    onConfirm,
    children,
    itemName = "mục này",
    title = "Xác nhận xóa",
    description,
    open: controlledOpen,
    onOpenChange,
}: ConfirmAlertProps) {
    const defaultDescription = `Bạn có chắc chắn muốn xóa *${itemName}*? Hành động này sẽ xóa tất cả dữ liệu liên quan và *không thể hoàn tác*.`;

    return (
        <AlertDialog open={controlledOpen} onOpenChange={onOpenChange}>
            {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}

            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-destructive flex-shrink-0" />
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    </div>
                </AlertDialogHeader>

                <AlertDialogDescription asChild>
                    <div className="text-sm text-muted-foreground">
                        {description || defaultDescription}
                    </div>
                </AlertDialogDescription>

                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild onClick={onConfirm}>
                        <Button variant="default">Xóa vĩnh viễn</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

