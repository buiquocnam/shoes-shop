import { Link } from "@/i18n/routing";
import Image from "next/image";
import { brandsApi } from "@/features/shared/services/brands.api";
import { BrandType } from "@/features/product/types";
import { getTranslations } from "next-intl/server";

export default async function BrandList() {
  const t = await getTranslations('HomePage.brands');
  const brandsResponse = await brandsApi.search({ size: 6 });

  if (!brandsResponse || !brandsResponse.data || brandsResponse.data.length === 0) {
    return null;
  }

  const displayBrands = brandsResponse.data;

  return (
    <>
      {/* Mobile / Tablet */}
      <section className="py-12 md:py-16 bg-surface-light lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('title')}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            {displayBrands.map((brand) => (
              <BrandItemCircle key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* Desktop marquee */}
      <section className="hidden lg:block w-full bg-muted py-16 overflow-hidden border-y border-border">
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee">
            {[0, 1, 2].map((set) => (
              <div key={set} className="flex items-center shrink-0">
                {displayBrands.map((brand) => (
                  <Link
                    key={`${set}-${brand.id}`}
                    href={`/products?brand_id=${brand.id}`}
                    className="group flex flex-col items-center gap-1 px-12 shrink-0 cursor-pointer transition-all duration-500"
                  >
                    {/* Logo */}
                    <div className="relative h-8 w-16 flex items-end">
                      <Image
                        src={brand.logo || "/placeholder.png"}
                        alt={brand.name}
                        fill
                        className="object-contain opacity-20 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-1"
                        unoptimized
                      />
                    </div>

                    {/* Text */}
                    <span className="text-5xl font-black tracking-tighter italic uppercase transition-all duration-500 text-muted-foreground/80 group-hover:text-primary group-hover:drop-shadow-md leading-none select-none whitespace-nowrap">
                      {brand.name}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
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
      {/* Logo */}
      <div className="relative h-8 sm:h-10 w-16">
        <Image
          src={brandImage}
          alt={brand.name}
          fill
          className="object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
          loading="lazy"
          unoptimized
        />
      </div>
    </Link>
  );
}
