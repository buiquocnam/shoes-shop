export const addressQueryKeys = {
  provinces: ["provinces"] as const,
  districts: (provinceCode: number) => ["districts", provinceCode] as const,
  wards: (districtCode: number) => ["wards", districtCode] as const,
  usersAddress: (userId: string) => ["usersAddress", userId] as const,
};
