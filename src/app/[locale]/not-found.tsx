'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 max-w-md animate-in fade-in zoom-in duration-500">
                <h1 className="text-9xl font-extrabold text-primary tracking-tighter">
                    404
                </h1>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">
                        Trang không tồn tại
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    </p>
                </div>
                <div className="pt-4">
                    <Button asChild size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        <Link href="/">
                            Quay về trang chủ
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
