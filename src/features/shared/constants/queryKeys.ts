/**
 * Centralized query keys for React Query
 * Prevents duplication and ensures consistency across the app
 *
 * This file re-exports query keys from separate files organized by domain:
 * - user-queryKeys: User-facing features (cart, checkout, profile, review)
 * - admin-queryKeys: Admin features (admin.variants, admin.dashboard)
 * - shared-queryKeys: Shared resources (auth, product, shared categories/brands)
 */

import { userQueryKeys } from "./user-queryKeys";
import { adminQueryKeys } from "./admin-queryKeys";
import { sharedQueryKeys } from "./shared-queryKeys";

export const queryKeys = {
  // User-facing features
  cart: userQueryKeys.cart,
  checkout: userQueryKeys.checkout,
  profile: userQueryKeys.profile,
  review: userQueryKeys.review,

  // Products (shared between user and admin)
  product: sharedQueryKeys.product,

  // Admin features
  admin: {
    variants: adminQueryKeys.variants,
    dashboard: adminQueryKeys.dashboard,
  },

  // Shared resources
  shared: {
    category: sharedQueryKeys.category,
    brand: sharedQueryKeys.brand,
  },
} as const;
