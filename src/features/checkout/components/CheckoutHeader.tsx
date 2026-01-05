import React from 'react';

interface CheckoutHeaderProps {
    title: string;
    description: string;
}

export function CheckoutHeader({ title, description }: CheckoutHeaderProps) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-tight lg:text-4xl">
                {title}
            </h1>
            <p className="text-base font-normal leading-normal text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

