export const PAYMENT_METHOD_IMAGES = {
  visa: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7PJEj6lyvSMJVAHeKDyr8ywyPcLhCzt5BKkv1Nnu8h1r3w9UmTx1zbNgYleokKyjm0w6ZpvyGSJaBxPuwBrX9oL8m8pRVV163s4c15fPSSUVek6MpqZkwqYNucpAsQx9Ta5tubk634xV3loZafRkYrKa2et-UJivgFEBESuuqGVBcG-Fi2JvDUA2wD6J-ULmAWkqva5uRl3htvHDgc1WuDz1s2MJ5qMsz0JHkA2KFhYH-nDx-H2buaFYnHGF9uJsQc-aB8BOKwGr7",
  mastercard:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBzc1ode3FlJIJzTmFhOwAmnB1mEJsOLCRE0bFOx8hj3qVb8i2qOl7USzsfZLly0-1DZivGMmY63M3hGoDVEXmI6nqeXUpHxX0JGbCZfgeaojDHb3UkbshINfsOS8BgE1Qe44pmloPoVADjpEjYIexnRAB5SBgBDXeZ0tLqr6kctq9Tijeyw8VyKh4j4twFXn7-bltVlYO7lXiNCcFXqoH-blJoebV5Hp3cIe-NYsfO-l0KMVqTxP5zoMftuTDtWrNwZcSwq9ix-XbN",
  amex: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw-fztf-Uc3K8Oh8EzyfPuaGKS3TxuhMhlGZp1IxfNT_K4-9purbR1swNkidN8Ck-Nkrw_OHacylygHOtCNCtsxJl7Y5Q3-LIBOi2Owtrs9vzZINM-Yf6Cv6qiPC85at6ryjnz7eVYOXBaBqyhKA8CL1QFyYg0wGqND6NxSDsv0Aw-EwsLaLAcy-0qGTHZ_6w5HEavoh1Jppo_k3hCf8b6JkMK8AhglnoZ-1g4RkUaKgEJrtWDZhnxxy5KvExQOyqvN4b47yQqWfKp",
  paypal:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAGzFCF2LigZqASMKt21Dt7KAuZPZlGp_b_uuMF9Hoaj7LslHinlKXhnR-8gbj5-XG5Ps487Zv-IGLHA4pQEWAVB_odazekS7K_Hfd_7gG6M_TfxIfWCfoK2vk7rQsigD_6VNBDs2quPYvCVVr68LCRFakvkN9_MFnIieBQxmls_MEs9hq5SJT32DWJYggdp4KCkrGZ7HDIAdG2Aa1ZmIjHd5Qob6GXhUSkY2-F1Ximz5zENLtuOZkiMjCQ1gAH-Tv7Mat67smTeU0H",
} as const;

export const CREDIT_CARD_BRANDS = [
  { name: "Visa", image: PAYMENT_METHOD_IMAGES.visa },
  { name: "Mastercard", image: PAYMENT_METHOD_IMAGES.mastercard },
  { name: "American Express", image: PAYMENT_METHOD_IMAGES.amex },
] as const;
