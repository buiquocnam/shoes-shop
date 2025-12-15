import Link from "next/link";
import Image from "next/image";
import { brandsApi } from "@/features/shared/services/brands.api";
import { BrandType } from "@/features/product/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default async function BrandList() {
    const brandsResponse = await brandsApi.search({ size: 6 });

    if (!brandsResponse || !brandsResponse.data || brandsResponse.data.length === 0) {
        return null;
    }

    const displayBrands = brandsResponse.data;

    return (
        <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Shop by Brand</h2>
                        <p className="text-gray-600">Find the perfect pair for every occasion.</p>
                    </div>
                    <Link
                        href="/products"
                        className="text-primary font-medium hover:underline flex items-center gap-1"
                    >
                        View All
                        <ArrowRight className="text-sm" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {displayBrands.map((brand) => (
                        <BrandItem key={brand.id} brand={brand} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface BrandItemProps {
    brand: BrandType;
}

function BrandItem({ brand }: BrandItemProps) {
    const brandImage = brand.logo || "/placeholder.png";

    return (
        <Link
            href={`/products?brand_id=${brand.id}`}
            className="group flex flex-col items-center gap-3"
        >
            <div
                className={cn(
                    "w-full aspect-square rounded-full bg-gray-100 overflow-hidden",
                    "flex items-center justify-center p-6",
                    "border border-transparent group-hover:border-primary/30",
                    "transition-all duration-300"
                )}
            >
                <Image
                    src={brandImage}
                    alt={brand.name}
                    width={120}
                    height={120}
                    className={cn(
                        "w-full h-full object-contain",
                        "group-hover:scale-110 transition-transform duration-300",
                        "opacity-80 group-hover:opacity-100",
                        "grayscale group-hover:grayscale-0"
                    )}
                    unoptimized
                />
            </div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {brand.name}
            </h3>
        </Link>
    );
}

