import { Spinner } from "@/components/ui/spinner";

export default function HomeLoading() {
    return (
        <div className="flex items-center justify-center py-24 md:py-32 min-h-[500px] bg-gradient-to-b from-white to-gray-50">
            <div className="text-center">
                <div className="relative inline-block mb-6">
                    <Spinner className="mx-auto size-10 text-primary animate-spin" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                </div>
                <p className="text-gray-700 text-lg font-semibold mb-2">Loading...</p>
                <p className="text-gray-500 text-sm">Please wait a moment</p>
                <div className="mt-6 flex justify-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}

