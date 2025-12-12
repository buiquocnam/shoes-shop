import { ProductCard } from "@/features/product/components";
import { productApi } from "@/features/product/services/product.api";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function HomeSection() {
    const bestSellers = await productApi.getProducts({
        size: 8,
        sort_by: 'countSell',
    });

    const products = bestSellers.data || [];

    if (products.length === 0) {
        return (
            <section className="py-16 md:py-24 text-center">
                <div className="max-w-2xl mx-auto">
                    <Sparkles className="mx-auto mb-4 w-8 h-8 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">No Best Sellers Yet</h2>
                    <p className="text-gray-600 mb-8">
                        There are currently no best-selling products to display. Please check back later!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-16 md:py-24 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                            Best Sellers
                        </span>
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Our Most Popular
                        <span className="block text-primary mt-2">Footwear Collection</span>
                    </h2>
                    <p className="text-md text-gray-600 max-w-2xl mx-auto">
                        Discover the shoes that everyone is talking about. Handpicked favorites from our community.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/products?sort_by=countSell">
                        <Button
                            variant="outline"
                            className="group px-8 py-6 text-base font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            View All Best Sellers
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                <svg
                    className="w-full h-16 text-gray-50"
                    viewBox="0 0 1440 80"
                    preserveAspectRatio="none"
                    fill="currentColor"
                >
                    <path d="M0,40 Q360,0 720,40 T1440,40 L1440,80 L0,80 Z" />
                </svg>
            </div>
        </section>
    );
} 