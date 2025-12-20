import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sản phẩm - Shoe Shop",
    description: "Duyệt bộ sưu tập giày của chúng tôi",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
