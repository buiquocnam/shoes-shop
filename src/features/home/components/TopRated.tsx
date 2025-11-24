import { ProductCard } from "@/features/product/components";
import { productApi } from "@/features/product/services/product.api";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function TopRated() {
    const topRatedProducts = await productApi.getTopRatedProducts();
    const products = topRatedProducts || [];

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="relative py-16 md:py-24 bg-primary/3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                            Top Rated
                        </span>
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Customer Favorites
                        <span className="block text-primary mt-2">Highest Rated Shoes</span>
                    </h2>
                    <p className="text-md text-gray-600 max-w-2xl mx-auto">
                        Loved by thousands of customers. These top-rated shoes have earned their place through exceptional quality and style.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-2 mb-12">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/products">
                        <Button
                            variant="outline"
                            className="group px-8 py-6 text-base font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            Explore All Products
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}