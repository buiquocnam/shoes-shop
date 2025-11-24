import { ProductDetailType } from "@/features/product/types";

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
  product: ProductDetailType
): Array<{ color: string; sizes: Array<{ size: number; stock: number }> }> => {
  const variants = product.variants;
  const variantsByColor = new Map<
    string,
    Array<{ size: number; stock: number }>
  >();

  variants.forEach((variant) => {
    const color = variant.color || "";
    const size = parseInt(variant.size.label) || 0;
    const stock = variant.stock || 0;

    if (!variantsByColor.has(color)) {
      variantsByColor.set(color, []);
    }
    variantsByColor.get(color)?.push({ size, stock });
  });

  return Array.from(variantsByColor.entries()).map(([color, sizes]) => ({
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

