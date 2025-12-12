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
    const [isFormOpen, setIsFormOpen] = useState(false);
    const handleFormSuccess = () => {
        setIsFormOpen(false);
    };

    /**
     * Xử lý khi user chọn address - gọi callback nếu có (cho checkout)
     */
    const handleAddressChange = (value: string) => {
        const address = usersAddress?.find((addr) => addr.id === value);
     
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-60">
                <Spinner />
            </div>
        );
    }

    // Empty state
    if (!usersAddress || usersAddress.length === 0) {
        return (
            <div className={`flex flex-col p-4 mt-8 ${className}`}>
                <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed px-6 py-14">
                    <div className="flex max-w-[480px] flex-col items-center gap-2">
                        <p className="text-lg font-bold max-w-[480px] text-center">
                            No Saved Addresses
                        </p>
                        <p className="text-sm font-normal leading-normal max-w-[480px] text-center">
                            You have no saved addresses. Add one for a faster checkout!
                        </p>
                    </div>
                    <Button
                        variant="default"
                        className="max-w-[480px]"
                        onClick={() => setIsFormOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="truncate">Add New Address</span>
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
                    <span className="truncate">Add New Address</span>
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
                    onValueChange={handleAddressChange}
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

