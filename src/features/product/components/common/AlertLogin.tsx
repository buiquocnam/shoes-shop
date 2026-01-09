"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface AlertLoginProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AlertLogin({ open, onOpenChange }: AlertLoginProps) {
    const router = useRouter();

    const handleLogin = () => {
        onOpenChange(false);
        router.push(`/login?redirect=${encodeURIComponent(window.location.href)}`);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Yêu cầu đăng nhập</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogin}>Đăng nhập</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}