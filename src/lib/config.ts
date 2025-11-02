// Application configuration

export const config = {
  app: {
    name: 'Shoe Shop',
    description: 'Your favorite shoe shop',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
  },
};

