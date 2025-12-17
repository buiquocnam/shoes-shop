# VNPay Payment Flow Guide

## 📋 Tổng quan

Tài liệu này mô tả flow thanh toán VNPay trong ứng dụng Shoe Shop, từ khi người dùng ấn nút checkout đến khi được chuyển hướng đến trang thanh toán VNPay.

---

## 🔄 Flow Diagram

```
Checkout Page → Click "Checkout" Button → Call Payment API → Receive paymentUrl → Redirect to VNPay
```

---

## 📝 Chi tiết Flow

### 1. **Trang Checkout**

- **Location**: `/checkout`
- **Component**: `CheckoutForm`
- **Action**: Người dùng điền thông tin và ấn nút **"Checkout"**

### 2. **Gọi Payment API**

Khi người dùng ấn nút checkout, hệ thống sẽ gọi API thanh toán VNPay:

**Endpoint:**

```
GET http://{{service_url}}:{{service_port}}/{{service_context}}/shoes/payment/vn-pay
```

**Query Parameters:**

- `amount`: Số tiền thanh toán (tham số thay đổi, ví dụ: `30000`)
- `variantSizeId`: ID của variant size sản phẩm (tham số thay đổi, ví dụ: `693940a9f35ab968c19b279e`)
- `bankCode`: Mã ngân hàng (mặc định: `NCB` - không cần truyền hoặc luôn là `NCB`)

**Example Request:**

```
http://localhost:8778/api/v1/shoes/payment/vn-pay?amount=30000&bankCode=NCB&variantSizeId=693940a9f35ab968c19b279e
```

**Lưu ý**: `bankCode` mặc định là `NCB`, có thể bỏ qua trong request hoặc luôn truyền giá trị `NCB`.

### 3. **Response từ API**

API sẽ trả về response với cấu trúc:

```json
{
  "code": 1000,
  "result": {
    "code": "ok",
    "message": "success",
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=3000000&vnp_BankCode=NCB&vnp_Command=pay&vnp_CreateDate=20251217171711&vnp_CurrCode=VND&vnp_ExpireDate=20251217174711&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang%3A20251217171711087769&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8778%2Fapi%2Fv1%2Fshoes%2Fpayment%2Fvn-pay-callback%3FvariantSizeId%3D693940a9f35ab968c19b279e%26userId%3D6910c195a0fe1c00e99330fb&vnp_TmnCode=2QQT1QID&vnp_TxnRef=20251217171711087769&vnp_Version=2.1.0&vnp_SecureHash=e0ce8531ab10daf2e76c731597f7f425ec6e7c1d4e2d19af3b742237d8f185872fd5c532882a1048769f5bb30659f692a56bdf00fc88f771c7a57e0c74354f36",
    "amount": null,
    "bankCode": null,
    "userId": null
  }
}
```

**Response Fields:**

- `code`: Mã response (1000 = success)
- `result.code`: Trạng thái ("ok" = thành công)
- `result.message`: Thông báo ("success")
- `result.paymentUrl`: **URL thanh toán VNPay** (quan trọng nhất)
- `result.amount`: null
- `result.bankCode`: null
- `result.userId`: null

### 4. **Tự động chuyển hướng**

Sau khi nhận được response:

1. **Extract `paymentUrl`** từ `result.paymentUrl`
2. **Tự động redirect** người dùng đến URL này bằng:
   - `window.location.href = paymentUrl` (client-side)
   - Hoặc `router.push(paymentUrl)` nếu dùng Next.js router

**Example Code:**

```typescript
// Trong component/hook xử lý checkout
const handleCheckout = async () => {
  try {
    // amount và variantSizeId lấy từ order/cart
    const amount = calculateTotalAmount(); // Thay đổi theo đơn hàng
    const variantSizeId = getSelectedVariantSizeId(); // Thay đổi theo sản phẩm
    const bankCode = "NCB"; // Mặc định

    const response = await paymentApi.createVnPayPayment({
      amount,
      bankCode, // Mặc định là "NCB"
      variantSizeId,
    });

    if (response.code === 1000 && response.result.code === "ok") {
      // Tự động chuyển hướng đến trang thanh toán VNPay
      window.location.href = response.result.paymentUrl;
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
};
```

**Hoặc sử dụng GET request trực tiếp:**

```typescript
const handleCheckout = async () => {
  try {
    const amount = calculateTotalAmount();
    const variantSizeId = getSelectedVariantSizeId();

    // GET request với query parameters
    const response = await fetch(
      `${API_BASE_URL}/shoes/payment/vn-pay?amount=${amount}&bankCode=NCB&variantSizeId=${variantSizeId}`
    );

    const data = await response.json();

    if (data.code === 1000 && data.result.code === "ok") {
      window.location.href = data.result.paymentUrl;
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
};
```

---

## 🔧 Implementation Checklist

### Frontend Implementation

- [ ] Tạo service/hook để gọi payment API
- [ ] Xử lý response và extract `paymentUrl`
- [ ] Implement auto-redirect đến `paymentUrl`
- [ ] Xử lý error cases
- [ ] Show loading state khi đang xử lý payment

### API Integration

- [ ] Đảm bảo API endpoint đúng format (GET method)
- [ ] Validate query parameters:
  - `amount`: Required, thay đổi theo đơn hàng
  - `variantSizeId`: Required, thay đổi theo sản phẩm
  - `bankCode`: Optional, mặc định "NCB"
- [ ] Handle response structure đúng
- [ ] Xử lý error responses

### User Experience

- [ ] Hiển thị loading indicator khi đang tạo payment
- [ ] Thông báo lỗi nếu payment creation fails
- [ ] Smooth transition khi redirect

---

## 📌 Notes

1. **Payment URL**: URL từ VNPay sẽ chứa tất cả thông tin cần thiết cho thanh toán
2. **Return URL**: VNPay sẽ redirect về `vnp_ReturnUrl` sau khi thanh toán xong
3. **Amount**: Amount trong URL VNPay được tính bằng VND (ví dụ: 30000 = 3000000 VND trong URL)
4. **Security**: `vnp_SecureHash` đảm bảo tính toàn vẹn của request

---

## 🐛 Troubleshooting

### Payment URL không hoạt động

- Kiểm tra `paymentUrl` có đúng format không
- Verify `vnp_SecureHash` có hợp lệ không
- Check network connection

### Redirect không xảy ra

- Đảm bảo `response.result.paymentUrl` tồn tại
- Check browser console cho errors
- Verify `window.location.href` assignment

### API Error

- Check API endpoint có đúng không
- Verify query parameters
- Check server logs

---

## 📚 Related Files

- `src/features/checkout/components/CheckoutForm.tsx` - Checkout form component
- `src/features/checkout/hooks/useCheckout.ts` - Checkout hooks
- `src/features/checkout/services/checkout.api.ts` - Checkout API service

---

**Last Updated**: 2024-12-17
