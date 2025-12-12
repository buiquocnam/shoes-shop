import { ProductDetailType, ProductVariant } from "@/features/product/types";

type VariantFormData = Array<{
  color: string;
  sizes: Array<{ size: string; stock: number }>;
}>;

type VariantRequest = Array<{ color: string; size: string }>;
type StockItem = Array<{ variantId: string; count: number }>;

/**
 * Generate URL-friendly slug from product name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

/**
 * Transform product variants from API format to form format
 * Groups variants by color and aggregates sizes with stock
 */
export const transformVariantsToForm = (
  variants: ProductVariant[]
): Array<{ color: string; sizes: Array<{ size: string; stock: number }> }> => {
  const grouped = new Map<string, Array<{ size: string; stock: number }>>();

  for (const variant of variants) {
    const color = variant.color || "";
    const size = variant.size?.label || "";
    if (size) {
      const sizes = grouped.get(color) || [];
      sizes.push({ size, stock: variant.stock || 0 });
      grouped.set(color, sizes);
    }
  }

  return Array.from(grouped.entries()).map(([color, sizes]) => ({
    color,
    sizes,
  }));
};

/**
 * Dialog titles for different form modes
 */
export const DIALOG_TITLES = {
  create: "Create New Product",
  info: "Edit Product Info",
  images: "Edit Product Images",
  variants: "Edit Product Variants",
} as const;

export enum FormMode {
  info = "info",
  images = "images",
  variants = "variants",
  create = "create",
}

/**
 * Flatten variants form data to API request format
 */
export const flattenVariants = (variants: VariantFormData): VariantRequest => {
  return variants.flatMap((v) =>
    v.sizes.map((s) => ({ color: v.color, size: s.size }))
  );
};

/**
 * Map variant results to stock items
 */
export const mapVariantsToStockItems = (
  variants: VariantFormData,
  variantResults: Array<{ id: string }>
): StockItem => {
  let idx = 0;
  return variants.flatMap((v) =>
    v.sizes
      .map((s) => ({ variantId: variantResults[idx++]?.id, count: s.stock }))
      .filter((item) => item.variantId)
  );
};

/**
 * Default form values for create mode
 */
export const getDefaultFormValues = (
  categories: Array<{ id: string }>,
  brands: Array<{ id: string }>
) => ({
  name: "New Product",
  description: "Product description",
  category: categories[0]?.id || "",
  brand: brands[0]?.id || "",
  price: 100,
  discount: 0,
  image: undefined,
  variants: [{ color: "Black", sizes: [{ size: 41, stock: 0 }] }],
});

/**
 * Transform product variants to form format with variantId for stock update
 */
export const transformVariantsToFormWithVariantId = (
  variants: ProductVariant[]
): Array<{
  color: string;
  sizes: Array<{ size: string; stock: number; variantId?: string }>;
}> => {
  const grouped = new Map<
    string,
    Array<{ size: string; stock: number; variantId?: string }>
  >();

  for (const variant of variants) {
    const color = variant.color || "";
    const size = variant.size?.label || "";
    if (size) {
      const sizes = grouped.get(color) || [];
      sizes.push({
        size,
        stock: variant.stock || 0,
        variantId: variant.id,
      });
      grouped.set(color, sizes);
    }
  }

  return Array.from(grouped.entries()).map(([color, sizes]) => ({
    color,
    sizes: sizes.sort((a, b) => a.size.localeCompare(b.size)),
  }));
};

/**
 * Process variants form data to separate update stock vs create new
 */
export const processVariantsForStockUpdate = (
  variants: Array<{
    color: string;
    sizes: Array<{ size: string; stock: number; variantId?: string }>;
  }>
) => {
  const stockItems: Array<{ variantId: string; count: number }> = [];
  const newVariants: Array<{ color: string; size: string }> = [];
  const newVariantsStock: number[] = [];

  variants.forEach((variant) => {
    variant.sizes.forEach((sizeItem) => {
      if (sizeItem.variantId) {
        // Existing variant - update stock
        stockItems.push({
          variantId: sizeItem.variantId,
          count: sizeItem.stock,
        });
      } else {
        // New variant - create and import stock
        newVariants.push({
          color: variant.color,
          size: sizeItem.size,
        });
        newVariantsStock.push(sizeItem.stock);
      }
    });
  });

  return { stockItems, newVariants, newVariantsStock };
};
