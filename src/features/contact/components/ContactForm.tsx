'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InputField, CustomField } from '@/components/form';
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  subject: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement contact form submission API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
      form.reset();
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Contact Information Sidebar */}
      <div className="lg:w-5/12 bg-primary text-white p-10 lg:p-14 relative overflow-hidden flex flex-col justify-between">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
          <p className="text-white/80 mb-10 leading-relaxed">
            Điền vào form và đội ngũ của chúng tôi sẽ phản hồi bạn trong vòng 24 giờ.
          </p>

          <div className="space-y-8">
            {/* Phone */}
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Điện thoại</p>
                <p className="text-white/80 text-sm font-medium tracking-wide">
                  +84 (123) 456-7890
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Email</p>
                <p className="text-white/80 text-sm font-medium tracking-wide">
                  hello@shoeshop.com
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Địa chỉ cửa hàng</p>
                <p className="text-white/80 text-sm font-medium tracking-wide leading-relaxed">
                  123 Đường Giày, Quận Thời Trang<br />
                  Thành phố Hồ Chí Minh, 70000, Việt Nam
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
          <p className="text-sm font-bold text-white/90 mb-4 uppercase tracking-widest text-xs">
            Theo dõi chúng tôi
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-primary flex items-center justify-center transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-primary flex items-center justify-center transition-all duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-primary flex items-center justify-center transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-primary flex items-center justify-center transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="lg:w-7/12 p-10 lg:p-14 bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Gửi tin nhắn cho chúng tôi
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              control={form.control}
              name="name"
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
            />
            <InputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="nguyenvana@example.com"
              type="email"
            />
          </div>

          <InputField
            control={form.control}
            name="subject"
            label="Tiêu đề"
            placeholder="Chúng tôi có thể giúp gì cho bạn?"
          />

          <CustomField
            control={form.control}
            name="message"
            label="Tin nhắn"
            render={(field, fieldState) => (
              <Textarea
                {...field}
                placeholder="Hãy cho chúng tôi biết thêm chi tiết..."
                className="min-h-[160px] resize-none"
              />
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-10 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Đang gửi...
                </>
              ) : (
                <>
                  <span>Gửi tin nhắn</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
