import Link from "next/link";
import Image from "next/image";
import { brandsApi } from "@/features/shared/services/brands.api";
import { BrandType } from "@/features/product/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BrandList() {
    const brandsResponse = await brandsApi.search({ size: 5 });

    if (!brandsResponse || !brandsResponse.data || brandsResponse.data.length === 0) {
        return null;
    }

    const displayBrands = brandsResponse.data;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-1 w-8 bg-primary rounded-full" />
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Nổi bật</span>
                        </div>
                        <h2 className="text-3xl font-bold ">
                            Thương hiệu <span className="text-primary">Hàng đầu</span>
                        </h2>
                    </div>

                    <Button
                        asChild
                        variant="default"
                        className="rounded-full hover:bg-white hover:text-primary px-6 transition-all duration-300 shadow-lg "
                    >
                        <Link href="/products" className="flex items-center gap-2">
                            Xem tất cả
                            <ArrowRight className="h-4 w-4 " />
                        </Link>
                    </Button>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
                    {displayBrands.map((brand) => (
                        <BrandItem
                            key={brand.id}
                            brand={brand}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BrandItem({ brand }: { brand: BrandType }) {
    const brandImage = brand.logo || "/placeholder.png";

    return (
        <Link
            href={`/products?brand_id=${brand.id}`}
            className="group flex flex-col items-center"
        >
            <div
                className={cn(
                    "relative w-full aspect-square rounded-full flex items-center justify-center p-8",
                    "shadow-md transition-all duration-200",
                    "border border-transparent", // ban đầu không có border
                    "hover:shadow-xl hover:-translate-y-2", // shadow và translate giữ nguyên
                    "hover:border-primary" // hover vào thì border primary
                )}
            >
                <div className="relative w-full h-full">
                    <Image
                        src={brandImage}
                        alt={brand.name}
                        fill
                        className="object-contain transition-transform duration-200 group-hover:scale-110"
                        unoptimized
                    />
                </div>
            </div>

            <div className="mt-4 text-center">
                <h3 className="font-bold text-sm text-slate-700 group-hover:text-primary transition-colors">
                    {brand.name}
                </h3>
            </div>
        </Link>
    );
}