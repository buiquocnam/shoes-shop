import type { Metadata } from 'next';
import { ContactForm } from '@/features/contact/components/ContactForm';

export const metadata: Metadata = {
  title: 'Liên hệ với chúng tôi - Shoe Shop',
  description: 'Liên hệ với Shoe Shop để được hỗ trợ về đơn hàng, kích thước, hoặc bất kỳ câu hỏi nào. Chúng tôi luôn sẵn sàng hỗ trợ bạn.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <section className="relative  lg:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Contact Content */}
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
