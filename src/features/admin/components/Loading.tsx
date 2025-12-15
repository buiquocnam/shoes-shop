import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function Loading() {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center",
                "w-full min-h-screen",
                "gap-4"
            )}
        >
            <Spinner className="w-10 h-10 text-primary" />
            <p className="text-primary font-medium">Loading...</p>
        </div>
    );
}