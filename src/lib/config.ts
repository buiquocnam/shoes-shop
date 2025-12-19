// Application configuration

export const config = {
  app: {
    name: "Shoe Shop",
    description: "Cửa hàng giày yêu thích của bạn",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 10000,
  },
};
