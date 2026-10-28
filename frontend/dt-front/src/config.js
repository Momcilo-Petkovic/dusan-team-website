// Shared settings for the whole frontend.

// Backend address. Set VITE_API_URL in .env to change it; it defaults to the
// local Spring Boot server. "/" means "the same server as the website" (used by Docker).
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

// Business contact details, shown in the Contact page and the footer
export const SITE = {
  phoneDisplay: "+381 64 2737 900",
  phoneLink: "tel:+381642737900",
  email: "dusanteamstevanovic@gmail.com",
};
