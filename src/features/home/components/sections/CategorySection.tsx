import Link from "next/link";
import { categoriesApi } from "@/features/shared/services/categories.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default async function CategorySection() {
  const categories = await categoriesApi.getAll({ size: 4 });

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-primary font-bold tracking-wider uppercase text-sm">Khám phá</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Danh mục sản phẩm</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category_id=${category.id}`} prefetch={true}>
              <Card className="h-48 p-8 flex flex-col justify-between hover:border-primary transition-colors border-border hover:border-2">
                <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                  {category.name}
                </h4>

                <div>
                  <span className="text-5xl font-black italic tracking-tighter leading-none">
                    {category.countProduct}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground/60 ml-2">
                    Sản phẩm
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-6 sm:mt-8">
          <Button asChild variant="outline" className="rounded-full font-semibold">
            <Link href="/products">
              Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

