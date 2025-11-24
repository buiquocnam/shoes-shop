import { Spinner } from "@/components/ui/spinner";

export default function ProductListLoading() {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="text-center">
                <Spinner className="mx-auto mb-4 size-8 text-primary" />
                <p className="text-gray-600 text-lg font-medium">Loading products...</p>
                <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
            </div>
        </div>
    );
}
