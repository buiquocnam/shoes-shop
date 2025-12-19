import { ProductCard } from "@/features/product/components";
import { productApi } from "@/features/product/services/product.api";
import { Sparkles } from "lucide-react";

export default async function HomeSection() {
    const bestSellers = await productApi.getProducts({
        size: 5,
        sort_by: "countSell",
    });

    const products = bestSellers.data || [];

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-14 bg-gray-50 ">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                            Bán chạy nhất
                        </span>
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Bộ sưu tập
                        <span className="block text-primary mt-2">Giày phổ biến nhất</span>
                    </h2>
                    <p className="text-md text-gray-600 max-w-2xl mx-auto">
                        Khám phá những đôi giày mà mọi người đang nói đến. Những sản phẩm yêu thích được chọn lọc từ cộng đồng của chúng tôi.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
} 