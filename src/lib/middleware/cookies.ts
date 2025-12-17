export function setAccessTokenCookie(
  token: string,
  maxAge: number = 60 * 60 * 1 // 1 hour
) {
  // Use SameSite=Lax to allow cookie to be sent when redirecting from external domains (e.g., payment gateway)
  document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}; SameSite=Lax${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}

export function removeAccessTokenCookie() {
  document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";
}
