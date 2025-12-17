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
    children: React.ReactNode;
    itemName?: string;
    title?: string;
    description?: string;
}

export function ConfirmAlert({
    onConfirm,
    children,
    itemName = "this item",
    title = "Confirm Delete",
    description,
}: ConfirmAlertProps) {
    const defaultDescription = `Are you sure you want to delete *${itemName}*? This action will delete all related data and *cannot be undone*.`;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    </div>
                </AlertDialogHeader>

                <AlertDialogDescription asChild>
                    <div className="text-sm text-gray-600">
                        {description || defaultDescription}
                    </div>
                </AlertDialogDescription>

                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild onClick={onConfirm}>
                        <Button variant="default">Delete Permanently</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

