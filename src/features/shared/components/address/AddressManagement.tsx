"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup } from "@/components/ui/radio-group";
import { AddressForm } from "@/features/shared/components/address/AddressForm";
import { AddressCard } from "@/features/shared/components/address/AddressCard";
import { AddressType } from "@/features/shared/types/address";

interface AddressManagementProps {
    userId: string;
    className?: string;
    usersAddress: AddressType[];
    isLoading: boolean;
    selectedAddress: AddressType | null;
}

export function AddressManagement({
    userId,
    className = "",
    usersAddress,
    selectedAddress,
    isLoading = false,
}: AddressManagementProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-60">
                <Spinner />
                <p className="text-sm text-gray-500">Đang tải địa chỉ...</p>
            </div>
        );
    }

    const [isFormOpen, setIsFormOpen] = useState(false);
    const handleFormSuccess = () => {
        setIsFormOpen(false);
    };



    // Empty state
    if (!usersAddress || usersAddress.length === 0) {
        return (
            <div className={`flex flex-col p-4 mt-8 ${className}`}>
                <div className="flex flex-col items-center gap-6 rounded-lg border-1 border-dashed px-6 py-14">
                    <div className="flex max-w-[480px] flex-col items-center gap-2">
                        <p className="text-lg font-bold max-w-[480px] text-center">
                            Chưa có địa chỉ đã lưu
                        </p>
                        <p className="text-sm font-normal leading-normal max-w-[480px] text-center">
                            Bạn chưa có địa chỉ đã lưu. Thêm một địa chỉ để thanh toán nhanh hơn!
                        </p>
                    </div>
                    <Button
                        variant="default"
                        className="max-w-[480px]"
                        onClick={() => setIsFormOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="truncate">Thêm địa chỉ mới</span>
                    </Button>
                </div>

                <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen} className="mt-6">
                    <CollapsibleContent>
                        <div className="rounded-lg border bg-card p-6 max-w-2xl mx-auto">
                            <AddressForm
                                userId={userId}
                                onSuccess={handleFormSuccess}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    }

    return (
        <section className={`w-full ${className}`}>
            <div className="flex items-center justify-between px-4 pb-3 pt-5">
                <span></span>
                <Button
                    variant="default"
                    className="max-w-[480px]"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                >
                    <Plus className="w-4 h-4" />
                    <span className="truncate">Thêm địa chỉ mới</span>
                </Button>
            </div>

            <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen} className="px-4">
                <CollapsibleContent>
                    <div className="rounded-lg border bg-card p-6 mb-4">
                        <AddressForm
                            userId={userId}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <div className="p-4">
                <RadioGroup
                    value={selectedAddress?.id || ""}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {usersAddress.map((address) => (
                        <AddressCard key={address.id} address={address} />
                    ))}
                </RadioGroup>
            </div>
        </section>
    );
}

