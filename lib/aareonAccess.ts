import { getTestMessageUrl } from "nodemailer";

export const AAREON_EMAIL_DOMAINS = ["gmail.com", "aareon.nl"];

const ALLOWED_EMAILS = [
  "niels.benjamins@aareon.nl",
  "roy.boelens@aareon.nl",
  "marcel.vrieling@aareon.nl",
  "arjen.lok@aareon.nl",
  "ria.feddema@aareon.nl",
  "sjoerd.meertens@aareon.nl",
  "daniel.hofman@aareon.nl",
  "catvika922@gmail.com",
  "e.horvath2004@aareon.nl",
];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAllowedAareonEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return ALLOWED_EMAILS.includes(normalized);
}