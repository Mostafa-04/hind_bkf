import { SITE } from "../config/site";
import { products } from "../data/products";
import { categories } from "../data/categories";

export const formatPrice = (n) =>
  `${Number(n).toLocaleString("fr-MA")} ${SITE.currency}`;

export const getDiscount = (price, oldPrice) =>
  oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;

export const getProductById = (id) =>
  products.find((p) => String(p.id) === String(id));

export const getCategory = (slug) => categories.find((c) => c.slug === slug);

export const getProductsByCategory = (slug) =>
  slug ? products.filter((p) => p.category === slug) : products;

export const getBestSellers = (limit = 4) =>
  products.filter((p) => p.bestSeller).slice(0, limit);

export const getNewProducts = (limit = 4) =>
  products.filter((p) => p.isNew).slice(0, limit);

export const getRelatedProducts = (product, limit = 4) =>
  products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);

export const countByCategory = (slug) =>
  products.filter((p) => p.category === slug).length;

export const getWhatsAppUrl = (product, quantity = 1) => {
  const message = [
    "Bonjour, je souhaite commander :",
    "",
    `Produit : ${product.name}`,
    `Quantité : ${quantity}`,
    `Prix : ${formatPrice(product.price)}`,
    "",
    "Merci de me confirmer la disponibilité.",
  ].join("\n");

  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
};