import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <main className="min-h-screen bg-background">
      <section className="relative lg:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto">
            <div className="bg-primary text-primary-foreground rounded-2xl shadow-xl overflow-hidden border border-border p-8 lg:p-10 relative">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-5">{t('title')}</h2>
                <p className="text-primary-foreground/80 mb-7 leading-relaxed text-base">
                  {t('description')}
                </p>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-foreground mb-1 text-base">{t('phone')}</p>
                      <p className="text-primary-foreground/80 text-sm font-medium tracking-wide">
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
                      <p className="font-bold text-primary-foreground mb-1 text-base">{t('email')}</p>
                      <p className="text-primary-foreground/80 text-sm font-medium tracking-wide">
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
                      <p className="font-bold text-primary-foreground mb-1 text-base">{t('address')}</p>
                      <p className="text-primary-foreground/80 text-sm font-medium tracking-wide leading-relaxed">
                        123 Shoes Street, Fashion District<br />
                        Ho Chi Minh City, 70000, Vietnam
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="relative z-10 mt-10 pt-7 border-t border-white/20">
                <p className="text-sm font-bold text-primary-foreground/90 mb-4 uppercase tracking-widest">
                  {t('followUs')}
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
          </div>
        </div>
      </section>
    </main>
  );
}
