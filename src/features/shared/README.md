# Shared Features

This folder contains shared resources used across different features (both user and admin).

## Structure

```
shared/
├── services/           # Shared API services
│   ├── categories.api.ts   # GET categories
│   ├── brands.api.ts       # GET brands
│   └── index.ts
├── hooks/             # Shared React hooks
│   ├── useCategories.ts    # Hook for fetching categories
│   ├── useBrands.ts        # Hook for fetching brands
│   └── index.ts
└── index.ts
```

## Usage

### For User Features (Product listing, filters, etc.)

```typescript
import { useCategories, useBrands } from "@/features/shared";

function ProductFilter() {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Use categories and brands for filtering
}
```

### For Admin Features

Admin features extend the shared APIs with CRUD operations:

```typescript
// Admin uses its own hooks that include CREATE/UPDATE/DELETE
import {
  useCategories, // GET from shared
  useCreateCategory, // CREATE - admin only
  useUpdateCategory, // UPDATE - admin only
  useDeleteCategory, // DELETE - admin only
} from "@/features/admin/categories";
```

## API Separation

- **Shared APIs** (`/features/shared/services/`): Only GET/SEARCH methods
  - `categoriesApi.getAll()` - Fetch all categories
  - `brandsApi.search(filters?)` - Search brands with pagination

- **Admin APIs** (`/features/admin/*/services/`): Full CRUD
  - Uses shared search/get methods
  - Adds CREATE, UPDATE, DELETE methods

## Benefits

1. **Single Source of Truth**: GET methods defined once, used everywhere
2. **Easy Maintenance**: Update API once, reflects everywhere
3. **Clear Separation**: User features can't accidentally call admin methods
4. **Optimized Caching**: Same query keys across user and admin
