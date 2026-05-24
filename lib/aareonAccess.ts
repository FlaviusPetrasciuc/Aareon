export const AAREON_EMAIL_DOMAINS = ["gmail.com", "aareon.nl"];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAllowedAareonEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  const parts = normalized.split("@");

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return false;
  }

  return AAREON_EMAIL_DOMAINS.includes(parts[1]);
}
