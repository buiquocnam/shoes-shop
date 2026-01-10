import { useTranslations } from "next-intl";

export function OrderEmptyState() {
  const t = useTranslations('Profile.orders');

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-12">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">{t('noOrders')}</h3>
        </div>
      </div>
    </div>
  );
}


