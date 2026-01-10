import { productApi } from "@/features/product/services/product.api";
import { ProductCard } from "@/features/product/components";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function HomeSection() {
    const t = await getTranslations('HomePage.bestSeller');
    const bestSellers = await productApi.getProducts({
        size: 8,
        sort_by: "countSell",
    });

    const products = bestSellers.data || [];

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-surface-light relative bg-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 text-center">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">{t('tag')}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">{t('title')}</h2>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button
                        asChild
                        variant="outline"
                        className="text-md rounded-full font-bold"
                    >
                        <Link href="/products">
                            {t('viewAll')}
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

