// Formatting utilities

export const formatCurrency = (amount: number): string => {
  // Format (ví dụ: 2905342.78 -> $2,905,343)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount); 
};


export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num); // 1000 -> 1,000
};

