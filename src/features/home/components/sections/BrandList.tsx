import Link from "next/link";
import Image from "next/image";
import { brandsApi } from "@/features/shared/services/brands.api";
import { BrandType } from "@/features/product/types";

export default async function BrandList() {
    const brandsResponse = await brandsApi.search({ size: 6 });

    if (!brandsResponse || !brandsResponse.data || brandsResponse.data.length === 0) {
        return null;
    }

    const displayBrands = brandsResponse.data;

    return (
        <>
            {/* Mobile/Tablet: Grid with circles */}
            <section className="py-12 md:py-16 bg-surface-light lg:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold  mb-6 text-center">Thương hiệu</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
                        {displayBrands.map((brand) => (
                            <BrandItemCircle
                                key={brand.id}
                                brand={brand}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Desktop: Marquee animation */}
            <section className="hidden lg:block w-full bg-muted py-16 overflow-hidden relative border-y border-border">
                <div className="flex w-max animate-marquee whitespace-nowrap">
                    {[0, 1].map((set) => (
                        <div key={set} className="flex items-center gap-24 px-12 shrink-0">
                            {displayBrands.map((brand) => (
                                <Link
                                    key={`${set}-${brand.id}`}
                                    href={`/products?brand_id=${brand.id}`}
                                    className="group cursor-pointer flex flex-col items-center gap-1 transition-all duration-500"
                                >
                                    <div className="h-12 flex items-end">
                                        <Image
                                            src={brand.logo || "/placeholder.png"}
                                            alt={brand.name}
                                            width={32}
                                            height={32}
                                            className="h-8 opacity-10 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-1 object-contain"
                                            unoptimized
                                        />
                                    </div>
                                    <span className="text-5xl font-black tracking-tighter italic uppercase transition-all duration-500 text-muted-foreground/80 group-hover:text-primary group-hover:drop-shadow-md leading-none select-none">
                                        {brand.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function BrandItemCircle({ brand }: { brand: BrandType }) {
    const brandImage = brand.logo || "/placeholder.png";

    return (
        <Link
            href={`/products?brand_id=${brand.id}`}
            className="group flex items-center justify-center size-24 sm:size-32 p-4 sm:p-6 bg-gray-50 border-2 border-transparent hover:border-primary rounded-full transition-all duration-300 shadow-sm hover:shadow-glow hover:-translate-y-1"
        >
            <Image
                src={brandImage}
                alt={brand.name}
                width={80}
                height={80}
                className="h-8 sm:h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 object-contain"
                loading="lazy"
                unoptimized
            />
        </Link>
    );
}

