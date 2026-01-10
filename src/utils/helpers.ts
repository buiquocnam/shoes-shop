// Helper utility functions

export const clsx = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lấy chữ cái đầu của tên người dùng
 * @param name - Tên người dùng
 * @returns Chữ cái đầu (2 chữ nếu có họ và tên)
 */
export const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name[0]?.toUpperCase() || "U";
};

/**
 * Lấy màu avatar dựa trên tên người dùng
 * @param name - Tên người dùng
 * @returns Object chứa background và text color classes
 */
export const getAvatarColor = (name: string): { bg: string; text: string } => {
  const colors = [
    { bg: "bg-primary/10", text: "text-primary" },
    { bg: "bg-success/10", text: "text-success" },
    { bg: "bg-warning/10", text: "text-warning" },
    { bg: "bg-destructive/10", text: "text-destructive" },
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

