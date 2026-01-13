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
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto">
            <div className="bg-primary text-white rounded-2xl shadow-xl overflow-hidden border border-border p-8 lg:p-10 ">
              <div className="z-10">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    {t('title')}
                  </h1>
                  <p className="text-lg max-w-2xl mx-auto">
                    {t('subtitle')}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-primary-foreground/10 rounded-lg group-hover:bg-primary-foreground/20 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{t('phone')}</p>
                      <p className=" text-sm font-medium tracking-wide">
                        {t('phoneValue')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-primary-foreground/10 rounded-lg group-hover:bg-primary-foreground/20 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{t('email')}</p>
                      <p className="text-sm font-medium tracking-wide">
                        {t('emailValue')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-primary-foreground/10 rounded-lg group-hover:bg-primary-foreground/20 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{t('address')}</p>
                      <p className="text-sm font-medium tracking-wide leading-relaxed">
                        {t('addressValue1')}<br />
                        {t('addressValue2')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-3xl p-8 border border-border mt-4 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t('form.title')}
                </h2>
                <div className="flex gap-4 justify-center">
                  {[
                    { Icon: Facebook, label: 'Facebook', href: '#' },
                    { Icon: Twitter, label: 'Twitter', href: '#' },
                    { Icon: Instagram, label: 'Instagram', href: '#' },
                    { Icon: Linkedin, label: 'LinkedIn', href: '#' },
                  ].map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="w-12 h-12 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-sm group"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
