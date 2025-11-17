import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export type HeroBannerProps = {
  image?: string;
  alt?: string;
  description?: string;
};

const HeroBanner = ({ image, alt }: HeroBannerProps) => {
  return (
    <div className="relative w-full mx-auto bg-primary text-white pt-24 pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={
            image ||
            "https://img.freepik.com/free-photo/pair-trainers_144627-37950.jpg"
          }
          alt={alt || "Hero background"}
          fill
          className="object-cover object-center scale-[1.6] opacity-[0.09]"
          unoptimized
          priority
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-wide">
          <span className="text-white drop-shadow-md">Step into</span>{" "}
          <span className="text-[#ffe1ef] drop-shadow-md">Style</span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
          Discover our exclusive collection of premium footwear designed <br />
          for comfort, elegance, and unforgettable style
        </p>

        <div className="flex justify-center">
          <Link 
        href="/products" 
        className="group inline-flex justify-center" 
      >
        <Button 
          className="bg-white text-primary text-sm hover:bg-gray-100 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2.5"
        >
          <span 
            className="
              relative z-10 
              text-primary 
            "
          >
            Shop Now
          </span>

          <ArrowRight 
            className="
              w-4 h-4 
              transition-transform duration-300 ease-out 
              group-hover:translate-x-1
              group-hover:animate-wiggle
            "
          />
        </Button>
      </Link>
        </div>
      </div>

      <div className="absolute -bottom-10 left-0 w-full z-20 overflow-hidden pointer-events-none">
        <svg
          className="w-full h-[140px] text-white"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="
                            M0,60
                            C250,0 450,120 720,60
                            C1000,0 1200,120 1440,60
                            L1440,160
                            L0,160
                            Z
                        "
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroBanner;
