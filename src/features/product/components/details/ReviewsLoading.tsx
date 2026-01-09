export default function ReviewsLoading() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:px-10 bg-white rounded-xl shadow-lg animate-pulse">
            <div className="text-center mb-12 mt-20">
                <div className="h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Column - Average Rating */}
                <div className="md:col-span-1 text-center space-y-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded mx-auto"></div>
                </div>

                {/* Right Columns - Rating Bars */}
                <div className="md:col-span-2 space-y-3 pt-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-8 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="h-20 w-full bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}






