'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateProfile } from '@/features/profile/hooks/useProfile';
import { Mail, User, Phone, Save, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

const getProfileSchema = (t: any) => z.object({
  name: z.string().min(2, t('validation.nameMin')),
  phone: z.string().optional(),
});

type ProfileFormValues = {
  name: string;
  phone?: string;
};

export default function ProfileInfoPage() {
  const t = useTranslations('Profile.info');
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const profileSchema = getProfileSchema(t);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (!user?.id) {
      return;
    }

    updateProfile({
      id: user.id,
      name: data.name,
      phone: data.phone,
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden p-6">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">{t('edit')}</h1>
      {/* Form */}
      <div className=" space-y-10">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Name */}
          <Field data-invalid={!!form.formState.errors.name} className="md:col-span-1">
            <FieldLabel>{t('name')}</FieldLabel>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" />
              <Input
                placeholder={t('namePlaceholder')}
                className="h-12 pl-11 pr-4 rounded-full"
                {...form.register("name")}
              />
            </div>
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          {/* Phone */}
          <Field data-invalid={!!form.formState.errors.phone} className="md:col-span-1">
            <FieldLabel>{t('phone')}</FieldLabel>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" />
              <Input
                placeholder={t('phonePlaceholder')}
                type="tel"
                className="h-12 pl-11 pr-4 rounded-full"
                {...form.register("phone")}
              />
            </div>
            <FieldError errors={[form.formState.errors.phone]} />
          </Field>

          {/* Email - Read only */}
          <div className="space-y-2 md:col-span-2">
            <FieldLabel >{t('email')}</FieldLabel>
            <div className="relative opacity-70">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" />
              <Input
                value={user?.email || ''}
                disabled
                type="email"
                className="h-12 pl-11 pr-11 rounded-full cursor-not-allowed"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" />
            </div>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col-reverse sm:flex-row gap-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="px-8 py-3 rounded-full m:w-auto w-full font-bold text-sm transition-colors"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 rounded-full m:w-auto w-full font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save className="w-[18px] h-[18px]" />
                  {t('save')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
