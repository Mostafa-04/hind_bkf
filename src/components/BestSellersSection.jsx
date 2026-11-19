import { Link } from "react-router-dom";
import { ArrowUpRight, ShoppingBag, Star } from "lucide-react";
import {
  getBestSellers,
  getCategory,
  formatPrice,
  getDiscount,
  getWhatsAppUrl,
} from "../utils/products";

/* Animation : les produits apparaissent l'un après l'autre au défilement,
   en CSS pur (--i = position dans la grille). Sans support du navigateur
   ou avec "réduire les animations", tout s'affiche simplement. */
const animationStyles = `
  @keyframes bs-reveal {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }
  @supports (animation-timeline: view()) {
    .bs-reveal {
      animation: bs-reveal linear both;
      animation-timeline: view();
      animation-range:
        entry calc(var(--i, 0) * 5%)
        entry calc(40% + var(--i, 0) * 5%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .bs-reveal { animation: none; }
  }
`;

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]";

/* Un seul badge par produit : la remise d'abord, puis nouveauté, puis best-seller */
const getBadge = (product) => {
  const discount = getDiscount(product.price, product.oldPrice);
  if (discount > 0) return `-${discount}%`;
  if (product.isNew) return "Nouveau";
  if (product.bestSeller) return "Best-seller";
  return null;
};

export default function BestSellersSection() {
  const products = getBestSellers(4);

  if (!products.length) return null;

  return (
    <section
      aria-labelledby="bestsellers-title"
      className="bg-[#111111] px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <style>{animationStyles}</style>

      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <header className="bs-reveal mx-auto mb-10 flex max-w-2xl flex-col items-center text-center sm:mb-14">
          <div aria-hidden="true" className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#D4A638] sm:w-10" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#D4A638]" />
            <span className="h-px w-8 bg-[#D4A638] sm:w-10" />
          </div>

          <h2
            id="bestsellers-title"
            className="font-serif text-3xl font-medium text-[#F8F6F0] sm:text-4xl lg:text-5xl"
          >
            Nos best-sellers
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-[#F8F6F0]/70 sm:text-base">
            Les produits préférés de nos clientes, choisis pour leur élégance
            et leur caractère.
          </p>
        </header>

        {/* Produits : 2 colonnes sur mobile, 4 sur grand écran */}
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product, index) => {
            const badge = getBadge(product);
            const category = getCategory(product.category)?.name;
            const image = product.image || product.images?.[0];
            const orderUrl = getWhatsAppUrl(product);
            const productHref = `/product/${product.id}`;

            return (
              <li
                key={product.id}
                className="bs-reveal group"
                style={{ "--i": index }}
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#292929]">
                  <Link
                    to={productHref}
                    aria-label={`Voir ${product.name}`}
                    className={`absolute inset-0 block ${focusRing}`}
                  >
                    <img
                      src={image}
                      alt={product.name}
                      width={800}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-105"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#111111]/50 via-transparent to-transparent"
                    />
                  </Link>

                  {badge && (
                    <span className="pointer-events-none absolute left-2.5 top-2.5 bg-[#D4A638] px-2.5 py-1 text-xs font-semibold text-[#111111] sm:left-4 sm:top-4 sm:px-3 sm:py-1.5">
                      {badge}
                    </span>
                  )}

                  {/* Commande rapide : apparaît au survol (ordinateur seulement) */}
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute inset-x-4 bottom-4 hidden min-h-11 translate-y-3 items-center justify-center gap-2 bg-[#D4A638] px-4 py-3 text-sm font-semibold text-[#111111] opacity-0 transition-[transform,opacity,background-color] duration-300 hover:bg-[#E8C66A] motion-reduce:transition-none [@media(hover:hover)]:flex [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 ${focusRing}`}
                  >
                    <ShoppingBag size={16} aria-hidden="true" />
                    Commander sur WhatsApp
                  </a>
                </div>

                {/* Infos */}
                <div className="pt-4 sm:pt-5">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    {category && (
                      <span className="truncate text-xs text-[#D4A638]">{category}</span>
                    )}

                    {product.rating > 0 && (
                      <span
                        role="img"
                        aria-label={`Note ${product.rating} sur 5`}
                        className="flex flex-none items-center gap-0.5"
                      >
                        {Array.from({ length: Math.round(product.rating) }).map((_, i) => (
                          <Star key={i} size={12} fill="#D4A638" stroke="#D4A638" aria-hidden="true" />
                        ))}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg leading-snug text-[#F8F6F0] sm:text-xl">
                    <Link
                      to={productHref}
                      className={`transition-colors duration-300 hover:text-[#D4A638] ${focusRing}`}
                    >
                      {product.name}
                    </Link>
                  </h3>

                  <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="text-base font-semibold text-[#D4A638]">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice > product.price && (
                      <span className="text-sm text-[#F8F6F0]/50 line-through">
                        <span className="sr-only">Ancien prix : </span>
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </p>

                  {/* Bouton visible en permanence sur tactile (pas de survol) */}
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 flex min-h-11 items-center justify-center gap-2 border border-[#D4A638] px-3 text-sm font-semibold text-[#D4A638] transition-colors duration-300 active:bg-[#D4A638] active:text-[#111111] [@media(hover:hover)]:hidden ${focusRing}`}
                  >
                    <ShoppingBag size={16} aria-hidden="true" />
                    Commander
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Voir tout */}
        <div className="bs-reveal mt-12 text-center sm:mt-16">
          <Link
            to="/shop"
            className={`group inline-flex min-h-12 items-center gap-3 border border-[#D4A638] px-8 py-4 text-sm font-semibold text-[#D4A638] transition-colors duration-300 hover:bg-[#D4A638] hover:text-[#111111] ${focusRing}`}
          >
            Voir tous les produits
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 motion-reduce:transition-none group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}