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
            <div className="flex flex-col items-center justify-center h-60 gap-3">
                <Spinner />
                <p className="text-sm text-muted-foreground">Đang tải địa chỉ...</p>
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
            <div className={`flex flex-col ${className}`}>
                <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-12">
                    <div className="flex flex-col items-center gap-3 text-center max-w-md">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Plus className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900 mb-1">
                                Chưa có địa chỉ đã lưu
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Thêm địa chỉ để thanh toán nhanh hơn và quản lý đơn hàng dễ dàng hơn
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="default"
                        className="gap-2"
                        onClick={() => setIsFormOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        Thêm địa chỉ mới
                    </Button>
                </div>

                <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen} className="mt-6">
                    <CollapsibleContent>
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
        <section className={`w-full space-y-6 ${className}`}>
            {/* Header with Title and Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Địa chỉ của tôi
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Quản lý địa chỉ giao hàng của bạn
                    </p>
                </div>
                <Button
                    variant="default"
                    className="gap-2 shrink-0"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                >
                    <Plus className="w-4 h-4" />
                    {isFormOpen ? "Đóng form" : "Thêm địa chỉ mới"}
                </Button>
            </div>

            {/* Add Address Form */}
            <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
                <CollapsibleContent>
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <AddressForm
                            userId={userId}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Address List */}
            {usersAddress.length > 0 && (
                <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">
                        Danh sách địa chỉ ({usersAddress.length})
                    </h4>
                    <RadioGroup
                        value={selectedAddress?.id || ""}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {usersAddress.map((address) => (
                            <AddressCard key={address.id} address={address} />
                        ))}
                    </RadioGroup>
                </div>
            )}
        </section>
    );
}

