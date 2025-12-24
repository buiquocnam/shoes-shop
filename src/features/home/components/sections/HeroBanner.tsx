import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[500px] lg:h-[650px] overflow-hidden bg-background-dark group">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop"
          alt="Hero Banner"
          fill
          priority
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8A"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-block py-1 px-3 mb-4 rounded bg-primary/20 border border-primary text-primary text-sm font-bold tracking-wider uppercase backdrop-blur-sm">
          HÀNG MỚI VỀ
          </span>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
            KHAI PHÁ <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">TỐC ĐỘ</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
            Trải nghiệm cảm giác thoải mái vượt trội với những đôi giày được thiết kế tối ưu cho chuyển động.
            Đế giày êm, đàn hồi tốt, hỗ trợ bàn chân hiệu quả, giúp bạn di chuyển nhẹ nhàng và ổn định hơn trong từng bước chạy hay hoạt động thường ngày.
          </p>
          
          <Link 
            href="/products"
            prefetch={true}
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary hover:bg-primary-hover text-white text-lg font-bold tracking-wide transition-all shadow-lg shadow-primary/40 hover:-translate-y-1"
          >
            Mua Ngay
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        <button className="w-12 h-1.5 rounded-full bg-primary"></button>
        <button className="w-12 h-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"></button>
        <button className="w-12 h-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"></button>
      </div>
    </section>
  );
};

export default HeroBanner;

