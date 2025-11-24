import { z } from 'zod';

export const shippingAddressSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['home', 'work', 'other']),
  fullName: z.string().min(1, 'Tên không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  city: z.string().min(1, 'Thành phố không được để trống'),
  state: z.string().min(1, 'Tỉnh/Thành phố không được để trống'),
  zipCode: z.string().min(1, 'Mã bưu điện không được để trống'),
  country: z.string().min(1, 'Quốc gia không được để trống'),
  phone: z.string().optional(),
});

export const paymentInfoSchema = z.object({
  method: z.enum(['credit_card', 'paypal']),
  cardNumber: z.string().optional(),
  expirationDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
}).refine((data) => {
  if (data.method === 'credit_card') {
    return !!data.cardNumber && !!data.expirationDate && !!data.cvv && !!data.cardholderName;
  }
  return true;
}, {
  message: 'Vui lòng điền đầy đủ thông tin thẻ tín dụng',
});

export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  shippingMethodId: z.string().min(1, 'Vui lòng chọn phương thức vận chuyển'),
  paymentInfo: paymentInfoSchema,
  discountCode: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export type PaymentInfoFormData = z.infer<typeof paymentInfoSchema>;







