import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductsApi } from '../services/products.api';
import {
	AdminProductFilters,
	ProductContentInput,
	CreateProductInput,
} from '../types';
import { ProductPaginationResponse, ProductDetailType } from '@/features/product/types';

export const useProducts = (filters?: AdminProductFilters) => {
	return useQuery<ProductPaginationResponse>({
		queryKey: ['admin:products', filters],
		queryFn: () => adminProductsApi.getAll(filters),
	});
};

export const useProduct = (id: string) => {
	return useQuery<ProductDetailType>({
		queryKey: ['admin:product', id],
		queryFn: () => adminProductsApi.getById(id),
		enabled: !!id && id.length > 0,
	});
};

export const useCreateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation<ProductDetailType, unknown, CreateProductInput>({
		mutationFn: async (data: CreateProductInput) => {
			// Step 1: Create product with images
			const productObject = {
				name: data.name,
				slug: data.slug,
				description: data.description,
				categoryId: data.categoryId,
				brandId: data.brandId,
				price: data.price,
				discount: data.discount,
			};
		
			console.log('Product object:', productObject);
			console.log('Images count:', data.images.length);
			
			const formData = new FormData();
			const requestBlob = new Blob([JSON.stringify(productObject)], {
				type: 'application/json',
			});
			formData.append('request', requestBlob, 'request.json');
			data.images.forEach((image) => {
				formData.append('files', image);
			});

			const productResult = await adminProductsApi.createProduct(formData);
			const productId = productResult.id;

			console.log("tep 1: Create product with images");

			// Step 2: Create variants (flatten variants with sizes)
			const variantRequests: Array<{ color: string; size: number }> = [];
			
			data.variants.forEach((variant) => {
				variant.sizes.forEach((sizeData) => {
					variantRequests.push({
						color: variant.color,
						size: sizeData.size,
					});
				});
			});

			const variantResults = await adminProductsApi.createVariants({
				productId,
				variants: variantRequests,
			});

			// Step 3: Import stock
			let variantIndex = 0;
			const stockItems: Array<{ variantId: string; count: number }> = [];
			
			data.variants.forEach((variant) => {
				variant.sizes.forEach((sizeData) => {
					if (variantResults[variantIndex]) {
						stockItems.push({
							variantId: variantResults[variantIndex].id,
							count: sizeData.stock,
						});
						variantIndex++;
					}
				});
			});

			if (stockItems.length > 0) {
				await adminProductsApi.importStock({
					productId,
					items: stockItems,
				});
			}

			// Return product detail by fetching it
			return await adminProductsApi.getById(productId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin:products'] });
		},
		onError: (error) => {
			console.error('Error creating product:', error);
		},
	});
};

// Update product content (info)
export const useUpdateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation<ProductDetailType, unknown, ProductContentInput>({
		mutationFn: (data: ProductContentInput) => adminProductsApi.updateContent(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['admin:products'] });
			queryClient.invalidateQueries({ queryKey: ['admin:product', data.product.id] });
		},
		onError: () => {
		},
	});
};

// Update product images
export const useUpdateProductImages = () => {
	const queryClient = useQueryClient();
	return useMutation<ProductDetailType, unknown, { productId: string; images: File[] }>({
		mutationFn: async ({ productId, images }) => {
			const formData = new FormData();
			const requestBlob = new Blob([JSON.stringify({ productId })], {
				type: 'application/json',
			});
			formData.append('request', requestBlob, 'request.json');
			images.forEach((image) => {
				formData.append('files', image);
			});
			return await adminProductsApi.updateImages(formData);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['admin:products'] });
			queryClient.invalidateQueries({ queryKey: ['admin:product', data.product.id] });
		},
		onError: () => {
		},
	});
};

// Update product variants
export const useUpdateProductVariants = () => {
	const queryClient = useQueryClient();
	return useMutation<ProductDetailType, unknown, { productId: string; variants: Array<{ color: string; sizes: Array<{ size: number; stock: number }> }> }>({
		mutationFn: async ({ productId, variants }) => {
			// Step 1: Create variants (flatten variants with sizes)
			const variantRequests: Array<{ color: string; size: number }> = [];
			
			variants.forEach((variant) => {
				variant.sizes.forEach((sizeData) => {
					variantRequests.push({
						color: variant.color,
						size: sizeData.size,
					});
				});
			});

			const variantResults = await adminProductsApi.createVariants({
				productId,
				variants: variantRequests,
			});

			// Step 2: Import stock
			let variantIndex = 0;
			const stockItems: Array<{ variantId: string; count: number }> = [];
			
			variants.forEach((variant) => {
				variant.sizes.forEach((sizeData) => {
					if (variantResults[variantIndex]) {
						stockItems.push({
							variantId: variantResults[variantIndex].id,
							count: sizeData.stock,
						});
						variantIndex++;
					}
				});
			});

			if (stockItems.length > 0) {
				await adminProductsApi.importStock({
					productId,
					items: stockItems,
				});
			}

			// Return product detail by fetching it
			return await adminProductsApi.getById(productId);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['admin:products'] });
			queryClient.invalidateQueries({ queryKey: ['admin:product', data.product.id] });
		},
		onError: () => {
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();
	return useMutation<void, unknown, string>({
		mutationFn: (id: string) => adminProductsApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin:products'] });
		},
		onError: () => {
		}
	});
};
