'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CartEmpty() {
    return (
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <Button asChild className="bg-primary text-white px-8 py-3 rounded-full font-bold">
                <Link href="/products">Start Shopping</Link>
            </Button>
        </div>
    );
}

































