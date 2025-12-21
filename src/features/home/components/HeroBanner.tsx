import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gray-100  pb-24 lg:pt-24 lg:pb-40">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <svg
          className="absolute bottom-0 w-full h-auto text-primary opacity-10"
          fill="currentColor"
          viewBox="0 0 1440 320"
        >
          <path
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,122.7C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fillOpacity="1"
          />
        </svg>
        <svg
          className="absolute bottom-[-20px] w-full h-auto text-primary opacity-20"
          fill="currentColor"
          viewBox="0 0 1440 320"
        >
          <path
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fillOpacity="1"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-6">
            <Badge
              variant="secondary"
              className={cn(
                "inline-block px-3 py-1 bg-primary/10 text-primary rounded-full",
                "text-sm font-semibold tracking-wide uppercase mb-2"
              )}
            >
              Sản phẩm mùa mới
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-serif font-black leading-tight text-gray-900">
              Bước vào <span className="text-primary">Phong cách</span> &{" "}
              <br />
              Đi cùng <span className="text-primary">Thoải mái</span>.
            </h1>

            <p className="text-lg text-gray-600 max-w-lg">
              Khám phá bộ sưu tập giày cao cấp mới nhất được thiết kế cho
              lối sống hiện đại. Thanh lịch, bền bỉ và được chế tác cho hành trình của bạn.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-transform hover:-translate-y-1"
                >
                  Mua sắm ngay
                </Button>
              </Link>

            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="relative z-10 aspect-[4/3] rounded-2xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/hero-banner.png"
                alt="Banner giày cao cấp"
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
