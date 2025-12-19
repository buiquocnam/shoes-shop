import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
                {/* 404 Number */}
                <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Không tìm thấy trang
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Trang có thể đã được di chuyển hoặc xóa.
                </p>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        <Home className="w-5 h-5" />
                        Về trang chủ
                    </Link>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                        <Search className="w-5 h-5" />
                        Duyệt sản phẩm
                    </Link>
                </div>
            </div>
        </div>
    );
}

