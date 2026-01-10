import { ProductPageClient } from "@/features/product/components/listing/ProductPageClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Products' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default function ProductPage() {
    return <ProductPageClient />;
}
