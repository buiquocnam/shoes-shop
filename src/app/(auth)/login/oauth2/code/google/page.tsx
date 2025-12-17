'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGoogleLogin } from '@/features/auth/hooks';
import { Spinner } from '@/components/ui/spinner';

export default function GoogleOAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate: loginWithGoogle, isPending } = useGoogleLogin();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      loginWithGoogle(code);
    } else {
      // No code found, redirect to login
      router.push('/login');
    }
  }, [searchParams, loginWithGoogle, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-lg font-semibold">Đang xử lý đăng nhập Google...</p>
        <p className="text-sm text-muted-foreground">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}
