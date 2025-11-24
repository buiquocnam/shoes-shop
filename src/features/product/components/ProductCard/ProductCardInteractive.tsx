"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ProductCardInteractiveProps {
    productId: string;
    children: ReactNode;
}

export default function ProductCardInteractive({
    productId,
    children
}: ProductCardInteractiveProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${productId}`);
    };

    return (
        <div onClick={handleClick} className="relative">
            {children}
        </div>
    );
}

