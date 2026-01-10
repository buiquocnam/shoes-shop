import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">

            <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
            <p className="text-gray-500">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
            <Link href="/" className="text-blue-500 hover:text-blue-600">Quay về trang chủ</Link>
        </div>
    );
}

export default NotFound;