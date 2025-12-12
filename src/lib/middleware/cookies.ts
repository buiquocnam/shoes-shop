export function setAccessTokenCookie(
  token: string,
  maxAge: number = 60 * 60 * 1 // 1 hour
) {
  // 7 days default
  document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}; SameSite=Strict${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}

export function removeAccessTokenCookie() {
  document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";
}
