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
                    <AlertDialogTitle>Login Required</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please login to add items to your cart.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogin}>Login</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}