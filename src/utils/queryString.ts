export function toQueryString(params?: Record<string, any>) {
  if (!params) return '';
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`)
    .join('&')
    .replace(/^/, '?');
}
