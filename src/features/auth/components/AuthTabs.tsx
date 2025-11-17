'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function AuthTabs() {
    const pathname = usePathname();
    const router = useRouter();

    const activeTab = pathname?.includes('/register') ? 'register' : 'login';

    const handleTabChange = (value: string) => {
        router.push(value === 'register' ? '/register' : '/login');
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto p-0 gap-2 ">
                <TabsTrigger
                    value="login"
                    className={cn(
                        "rounded-lg px-6 py-3 text-sm font-semibold uppercase transition-all",
                        "data-[state=active]:bg-[#1a365d] data-[state=active]:text-white data-[state=active]:shadow-none",
                        "data-[state=inactive]:bg-white data-[state=inactive]:text-[#1a365d] data-[state=inactive]:border data-[state=inactive]:border-[#1a365d]"
                    )}
                >
                    LOG IN
                </TabsTrigger>
                <TabsTrigger
                    value="register"
                    className={cn(
                        "rounded-lg px-6 py-3 text-sm font-semibold uppercase transition-all",
                        "data-[state=active]:bg-[#1a365d] data-[state=active]:text-white data-[state=active]:shadow-none",
                        "data-[state=inactive]:bg-white data-[state=inactive]:text-[#1a365d] data-[state=inactive]:border data-[state=inactive]:border-[#1a365d]"
                    )}
                >
                    CREATE ACCOUNT
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
