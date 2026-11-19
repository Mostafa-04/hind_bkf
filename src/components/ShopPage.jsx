import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Eye,
  X,
  Check,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import { categories } from "../data/categories";
import Reveal from "../components/Reveal";
import {
  formatPrice,
  getDiscount,
  getCategory,
  countByCategory,
  getWhatsAppUrl,
} from "../utils/products";

/* ==========================================
   CONSTANTES
========================================== */

const PER_PAGE = 6;

const PRICES = products.map((p) => p.price);
const PRICE_MIN = Math.floor(Math.min(...PRICES) / 50) * 50;
const PRICE_MAX = Math.ceil(Math.max(...PRICES) / 50) * 50;

const SORT_OPTIONS = [
  { value: "default", label: "Trier par défaut" },
  { value: "popular", label: "Les plus populaires" },
  { value: "newest", label: "Nouveautés" },
  { value: "asc", label: "Prix croissant" },
  { value: "desc", label: "Prix décroissant" },
];

const CATEGORY_FILTERS = [
  { slug: "all", name: "Tous", count: products.length },
  ...categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: countByCategory(c.slug),
  })),
];

const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/* ==========================================
   HOOKS
========================================== */

function useLockScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

function useEscape(active, handler) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && handler();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, handler]);
}

// Passe à true juste après le montage : permet une transition d'entrée en CSS
function useEntered(active) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!active) {
      setEntered(false);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [active]);
  return entered;
}

function useFavorites() {
  const [ids, setIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("luban:favorites"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const toggle = useCallback((id) => {
    setIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem("luban:favorites", JSON.stringify(next));
      } catch {
        /* stockage indisponible : on ignore */
      }
      return next;
    });
  }, []);

  return { ids, toggle };
}

/* ==========================================
   HEADER
========================================== */

function ShopHeader({ category }) {
  const active = category !== "all" ? getCategory(category) : null;

  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-14 text-center sm:pb-12 lg:pb-16 lg:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(212,166,56,0.2),transparent_70%)]"
      />

      <Reveal key={category}>
        <div className="relative">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#B18A32] sm:text-xs">
            {active ? active.subtitle : "Découvrez notre univers"}
          </span>

          <h1 className="mt-5 font-serif text-4xl text-[#29251F] sm:text-5xl lg:text-6xl">
            {active ? (
              <span className="italic text-[#D4A638]">{active.name}</span>
            ) : (
              <>
                Notre <span className="italic text-[#D4A638]">boutique</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#29251F]/55">
            {active
              ? active.description
              : "Explorez notre sélection de parfums, de boukhour et d'encens, des créations inspirées par l'élégance orientale."}
          </p>

          <nav
            aria-label="Fil d'Ariane"
            className="mt-7 flex items-center justify-center gap-3 text-xs"
          >
            <Link to="/" className="text-[#29251F]/50 hover:text-[#D4A638]">
              Accueil
            </Link>
            <span className="text-[#D4A638]">/</span>
            {active ? (
              <>
                <Link
                  to="/shop"
                  className="text-[#29251F]/50 hover:text-[#D4A638]"
                >
                  Boutique
                </Link>
                <span className="text-[#D4A638]">/</span>
                <span className="text-[#29251F]">{active.name}</span>
              </>
            ) : (
              <span className="text-[#29251F]">Boutique</span>
            )}
          </nav>
        </div>
      </Reveal>
    </section>
  );
}

/* ==========================================
   FILTRES (contenu partagé desktop / mobile)
========================================== */

function FilterPanel({ category, onCategory, maxPrice, onMaxPrice }) {
  return (
    <div>
      <div className="border-b border-[#29251F]/10 pb-7">
        <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]">
          Catégories
        </h4>

        <ul className="space-y-3">
          {CATEGORY_FILTERS.map(({ slug, name, count }) => {
            const active = category === slug;
            return (
              <li key={slug}>
                <button
                  onClick={() => onCategory(slug)}
                  aria-pressed={active}
                  className="group flex w-full items-center justify-between py-1 text-left text-sm"
                >
                  <span
                    className={`transition-all duration-300 group-hover:translate-x-1 ${
                      active
                        ? "font-semibold text-[#B18A32]"
                        : "text-[#29251F]/60 group-hover:text-[#B18A32]"
                    }`}
                  >
                    {name}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-[#29251F]/35">
                    {active && <Check size={13} className="text-[#D4A638]" />}
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-7">
        <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]">
          Filtrer par prix
        </h4>

        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step="10"
          value={maxPrice}
          onChange={(e) => onMaxPrice(Number(e.target.value))}
          aria-label="Prix maximum"
          className="w-full cursor-pointer accent-[#D4A638]"
        />

        <div className="mt-4 flex items-center justify-between text-xs text-[#29251F]/60">
          <span>{formatPrice(PRICE_MIN)}</span>
          <span className="font-semibold text-[#B18A32]">
            Jusqu'à {formatPrice(maxPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   TOOLBAR + CHIPS
========================================== */

function ShopToolbar({
  search,
  onSearch,
  sortBy,
  onSort,
  total,
  onOpenFilters,
  activeCount,
}) {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#29251F]/35"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Rechercher un parfum, un boukhour…"
          aria-label="Rechercher un produit"
          className="w-full border border-[#29251F]/15 bg-white py-3.5 pl-11 pr-11 text-sm outline-none transition-colors focus:border-[#D4A638]"
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            aria-label="Effacer la recherche"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#29251F]/40 transition-colors hover:text-[#29251F]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#29251F]/60" aria-live="polite">
          <span className="font-semibold text-[#29251F]">{total}</span>{" "}
          produit{total > 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 border border-[#29251F]/15 bg-white px-4 py-3 text-xs uppercase tracking-wider transition-colors hover:border-[#D4A638] lg:hidden"
          >
            <SlidersHorizontal size={14} />
            Filtres
            {activeCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D4A638] text-[9px] font-bold text-[#1F1A14]">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSort(e.target.value)}
              aria-label="Trier les produits"
              className="w-44 cursor-pointer appearance-none border border-[#29251F]/15 bg-white px-4 py-3 pr-9 text-xs outline-none transition-colors focus:border-[#D4A638] sm:w-52"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveFilters({ chips }) {
  if (!chips.length) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="group flex items-center gap-2 border border-[#D4A638]/50 bg-[#D4A638]/10 px-3 py-1.5 text-xs text-[#29251F] transition-colors hover:bg-[#D4A638]/25"
        >
          {chip.label}
          <X
            size={12}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
        </button>
      ))}
    </div>
  );
}

/* ==========================================
   CARTE PRODUIT
========================================== */

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onQuickView,
  onAddToCart,
}) {
  const discount = getDiscount(product.price, product.oldPrice);
  const category = getCategory(product.category);
  const hoverImage = product.images?.[1];
  const detailsUrl = `/product/${product.id}`;

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F0ECE5]">
        <Link
          to={detailsUrl}
          aria-label={`Voir ${product.name}`}
          className="absolute inset-0 block"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 motion-reduce:transition-none ${
              hoverImage ? "group-hover:opacity-0" : ""
            }`}
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-[1] flex flex-col items-start gap-1.5 sm:left-4 sm:top-4">
          {product.badge && (
            <span className="bg-[#D4A638] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#1F1A14]">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#1F1A14] px-2.5 py-1.5 text-[9px] font-bold tracking-widest text-[#E8C66A]">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favori */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Retirer ${product.name} des favoris`
              : `Ajouter ${product.name} aux favoris`
          }
          className={`absolute right-2.5 top-2.5 z-[2] flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all duration-300 hover:scale-110 sm:right-4 sm:top-4 ${
            isFavorite
              ? "bg-[#D4A638] text-white"
              : "bg-white/90 text-[#29251F] hover:bg-[#D4A638] hover:text-white"
          }`}
        >
          <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Actions desktop (au survol) */}
        <div className="absolute inset-x-4 bottom-4 z-[2] hidden translate-y-4 gap-2 opacity-0 transition-all duration-300 focus-within:translate-y-0 focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
          <button
            onClick={() => onAddToCart(product)}
            className="flex flex-1 items-center justify-center gap-2 bg-[#D4A638] py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#1F1A14] transition-colors hover:bg-[#E8C66A]"
          >
            <ShoppingBag size={14} />
            Ajouter au panier
          </button>
          <button
            onClick={() => onQuickView(product)}
            aria-label={`Aperçu rapide de ${product.name}`}
            className="flex w-11 items-center justify-center bg-[#F8F6F0] text-[#1F1A14] transition-colors hover:bg-[#1F1A14] hover:text-[#F8F6F0]"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="pt-4 text-center sm:pt-5">
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#B18A32]">
          {category?.name ?? product.category}
        </p>

        <h3 className="font-serif text-base leading-snug text-[#29251F] transition-colors group-hover:text-[#B18A32] sm:text-lg">
          <Link to={detailsUrl}>{product.name}</Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="text-sm font-semibold text-[#29251F]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-[#29251F]/40 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Actions mobile / tablette (toujours visibles) */}
        <div className="mt-4 flex gap-2 lg:hidden">
          <button
            onClick={() => onAddToCart(product)}
            className="flex flex-1 items-center justify-center gap-2 border border-[#29251F]/20 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#29251F] transition-colors hover:border-[#D4A638] hover:bg-[#D4A638] active:bg-[#D4A638]"
          >
            <ShoppingBag size={14} />
            Ajouter
          </button>
          <button
            onClick={() => onQuickView(product)}
            aria-label={`Aperçu rapide de ${product.name}`}
            className="flex w-10 items-center justify-center border border-[#29251F]/20 text-[#29251F] transition-colors hover:border-[#D4A638] hover:bg-[#D4A638] active:bg-[#D4A638]"
          >
            <Eye size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ==========================================
   GRILLE
========================================== */

function ProductGrid({
  items,
  favoriteIds,
  onToggleFavorite,
  onQuickView,
  onAddToCart,
  onReset,
}) {
  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="mx-auto mb-5 text-[#D4A638]/50" size={36} />
        <h3 className="font-serif text-2xl text-[#29251F]">
          Aucun produit trouvé
        </h3>
        <p className="mt-3 text-sm text-[#29251F]/50">
          Essayez de modifier votre recherche ou vos filtres.
        </p>
        <button
          onClick={onReset}
          className="mt-7 bg-[#1F1A14] px-7 py-4 text-xs uppercase tracking-widest text-white transition-colors hover:bg-[#D4A638] hover:text-[#1F1A14]"
        >
          Réinitialiser les filtres
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-12">
      {items.map((product, i) => (
        <Reveal key={product.id} delay={(i % 3) * 100}>
          <ProductCard
            product={product}
            isFavorite={favoriteIds.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
          />
        </Reveal>
      ))}
    </div>
  );
}

/* ==========================================
   PAGINATION
========================================== */

function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const sorted = [
    ...new Set([1, total, current - 1, current, current + 1]),
  ]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  return sorted.flatMap((p, i) =>
    i > 0 && p - sorted[i - 1] > 1 ? ["…", p] : [p]
  );
}

function ShopPagination({ currentPage, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const btn =
    "flex h-10 w-10 items-center justify-center text-xs transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-center gap-2 lg:mt-16"
    >
      <button
        disabled={currentPage === 1}
        onClick={() => onPage(currentPage - 1)}
        aria-label="Page précédente"
        className={`${btn} border border-[#29251F]/15 hover:border-[#D4A638] disabled:opacity-30 disabled:hover:border-[#29251F]/15`}
      >
        <ChevronLeft size={14} />
      </button>

      {getPages(currentPage, totalPages).map((page, i) =>
        page === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-[#29251F]/40">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPage(page)}
            aria-current={currentPage === page ? "page" : undefined}
            aria-label={`Page ${page}`}
            className={`${btn} ${
              currentPage === page
                ? "bg-[#D4A638] font-bold text-[#1F1A14]"
                : "border border-[#29251F]/15 text-[#29251F] hover:border-[#D4A638]"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPage(currentPage + 1)}
        aria-label="Page suivante"
        className={`${btn} border border-[#29251F]/15 hover:border-[#D4A638] disabled:opacity-30 disabled:hover:border-[#29251F]/15`}
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}

/* ==========================================
   QUICK VIEW
========================================== */

function QuickViewModal({ product, onClose, onAddToCart }) {
  const open = Boolean(product);
  const entered = useEntered(open);
  useLockScroll(open);
  useEscape(open, onClose);

  if (!product) return null;

  const category = getCategory(product.category);
  const discount = getDiscount(product.price, product.oldPrice);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 sm:items-center sm:p-4 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        className={`relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto bg-[#F8F5EF] transition-all duration-300 sm:grid-cols-2 ${
          entered
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition-colors hover:bg-[#D4A638] hover:text-white"
        >
          <X size={16} />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-full"
        />

        <div className="flex flex-col justify-center p-6 sm:p-9">
          <p className="text-xs uppercase tracking-widest text-[#B18A32]">
            {category?.name ?? product.category}
          </p>

          <h2 className="mt-3 font-serif text-2xl text-[#29251F] sm:text-3xl">
            {product.name}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xl font-semibold text-[#B18A32]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-sm text-[#29251F]/40 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="bg-[#1F1A14] px-2 py-1 text-[10px] font-bold text-[#E8C66A]">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-7 text-[#29251F]/60">
            {product.description}
          </p>

          <p className="mt-4 flex items-center gap-2 text-xs text-[#29251F]/60">
            <span className="h-2 w-2 rounded-full bg-[#D4A638]" />
            {product.availability}
          </p>

          <div className="mt-7 space-y-3">
            <button
              onClick={() => onAddToCart(product)}
              className="flex w-full items-center justify-center gap-2 bg-[#D4A638] py-4 text-xs font-bold uppercase tracking-widest text-[#1F1A14] transition-colors hover:bg-[#E5BD5D]"
            >
              <ShoppingBag size={15} />
              Ajouter au panier
            </button>

            <a
              href={getWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 border border-[#29251F]/20 py-4 text-xs font-bold uppercase tracking-widest text-[#29251F] transition-colors hover:border-[#1F1A14] hover:bg-[#1F1A14] hover:text-white"
            >
              <MessageCircle size={15} />
              Commander via WhatsApp
            </a>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="block pt-1 text-center text-[11px] uppercase tracking-widest text-[#B18A32] underline-offset-4 hover:underline"
            >
              Voir tous les détails
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   DRAWER FILTRES MOBILE
========================================== */

function MobileFilterDrawer({
  open,
  onClose,
  resultCount,
  onReset,
  canReset,
  ...panelProps
}) {
  useLockScroll(open);
  useEscape(open, onClose);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[90] transition-[visibility] duration-500 lg:hidden ${
        open ? "visible" : "invisible"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filtres"
        className={`absolute right-0 top-0 flex h-[100dvh] w-[88%] max-w-sm flex-col bg-[#F8F5EF] shadow-2xl transition-transform duration-500 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#29251F]/10 px-6 py-5">
          <h3 className="font-serif text-2xl">Filtres</h3>
          <button
            onClick={onClose}
            aria-label="Fermer les filtres"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#29251F]/10 transition-colors hover:bg-[#D4A638] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FilterPanel {...panelProps} />
        </div>

        <div className="flex gap-3 border-t border-[#29251F]/10 bg-[#F8F5EF] px-6 py-5">
          <button
            onClick={onReset}
            disabled={!canReset}
            className="border border-[#29251F]/20 px-5 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors hover:border-[#1F1A14] disabled:opacity-30"
          >
            Effacer
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#D4A638] py-4 text-xs font-bold uppercase tracking-widest text-[#1F1A14] transition-colors hover:bg-[#E5BD5D]"
          >
            Voir {resultCount} produit{resultCount > 1 ? "s" : ""}
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ==========================================
   TOAST
========================================== */

function ToastItem({ text }) {
  const entered = useEntered(true);

  return (
    <div
      className={`flex items-center gap-3 bg-[#1F1A14] px-5 py-3.5 text-sm text-[#F8F6F0] shadow-2xl transition-all duration-300 ${
        entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <Check size={16} className="shrink-0 text-[#D4A638]" />
      {text}
    </div>
  );
}

function Toast({ toast }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[110] flex justify-center px-4"
    >
      {toast && <ToastItem key={toast.id} text={toast.text} />}
    </div>
  );
}

/* ==========================================
   PAGE
========================================== */

export default function ShopPage() {
  const { addToCart } = useCart();
  const favorites = useFavorites();
  const resultsRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // L'URL est la seule source de vérité : ?category=boukhour&sort=asc&page=2
  const rawCategory = (searchParams.get("category") ?? "all").toLowerCase();
  const category = CATEGORY_FILTERS.some((c) => c.slug === rawCategory)
    ? rawCategory
    : "all";
  const sortBy = searchParams.get("sort") ?? "default";
  const requestedPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [quickView, setQuickView] = useState(null);
  const [mobileFilter, setMobileFilter] = useState(false);
  const [toast, setToast] = useState(null);

  const closeQuickView = useCallback(() => setQuickView(null), []);
  const closeFilters = useCallback(() => setMobileFilter(false), []);

  const updateParams = useCallback(
    (changes) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(changes).forEach(([key, value]) => {
            if (value === "all" || value === "default" || value === 1) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          });
          // Tout changement de filtre ramène à la page 1
          if (!("page" in changes)) next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const resetPage = () => {
    if (searchParams.has("page")) updateParams({});
  };

  const handleSearch = (value) => {
    setSearch(value);
    resetPage();
  };

  const handleMaxPrice = (value) => {
    setMaxPrice(value);
    resetPage();
  };

  const resetFilters = () => {
    setSearch("");
    setMaxPrice(PRICE_MAX);
    setSearchParams({}, { replace: true });
  };

  // Filtrer + rechercher + trier
  const filtered = useMemo(() => {
    const q = normalize(search.trim());

    const result = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (!q) return true;

      const haystack = normalize(
        [
          p.name,
          getCategory(p.category)?.name,
          p.shortDescription,
          ...(p.tags ?? []),
        ].join(" ")
      );
      return haystack.includes(q);
    });

    switch (sortBy) {
      case "asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "popular":
        result.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
        break;
      default:
        break;
    }

    return result;
  }, [category, maxPrice, search, sortBy]);

  // Pagination (la page est bornée, pas besoin d'useEffect pour la réinitialiser)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const goToPage = (page) => {
    updateParams({ page });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Panier + toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setToast({ id: Date.now(), text: `${product.name} ajouté au panier` });
  };

  const handleQuickAdd = (product) => {
    handleAddToCart(product);
    closeQuickView();
  };

  // Filtres actifs
  const chips = [
    category !== "all" && {
      key: "category",
      label: getCategory(category)?.name,
      onRemove: () => updateParams({ category: "all" }),
    },
    maxPrice < PRICE_MAX && {
      key: "price",
      label: `Jusqu'à ${formatPrice(maxPrice)}`,
      onRemove: () => handleMaxPrice(PRICE_MAX),
    },
    search.trim() && {
      key: "search",
      label: `« ${search.trim()} »`,
      onRemove: () => handleSearch(""),
    },
  ].filter(Boolean);

  const activeFilterCount =
    Number(category !== "all") + Number(maxPrice < PRICE_MAX);
  const canReset = chips.length > 0 || sortBy !== "default";

  const panelProps = {
    category,
    onCategory: (slug) => updateParams({ category: slug }),
    maxPrice,
    onMaxPrice: handleMaxPrice,
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F8F5EF]">
      <ShopHeader category={category} />

      <section
        ref={resultsRef}
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-10 sm:px-6 lg:px-10 lg:py-16"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar desktop */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32 border border-[#29251F]/10 bg-white p-6">
              <div className="mb-7 flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#29251F]">Filtres</h3>
                <button
                  onClick={resetFilters}
                  disabled={!canReset}
                  className="text-xs text-[#B18A32] underline underline-offset-4 transition-opacity disabled:no-underline disabled:opacity-30"
                >
                  Réinitialiser
                </button>
              </div>
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          {/* Produits */}
          <div className="lg:col-span-9">
            <ShopToolbar
              search={search}
              onSearch={handleSearch}
              sortBy={sortBy}
              onSort={(value) => updateParams({ sort: value })}
              total={filtered.length}
              onOpenFilters={() => setMobileFilter(true)}
              activeCount={activeFilterCount}
            />

            <ActiveFilters chips={chips} />

            <ProductGrid
              key={`${category}-${sortBy}-${currentPage}`}
              items={pageItems}
              favoriteIds={favorites.ids}
              onToggleFavorite={favorites.toggle}
              onQuickView={setQuickView}
              onAddToCart={handleAddToCart}
              onReset={resetFilters}
            />

            <ShopPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPage={goToPage}
            />
          </div>
        </div>
      </section>

      <QuickViewModal
        product={quickView}
        onClose={closeQuickView}
        onAddToCart={handleQuickAdd}
      />

      <MobileFilterDrawer
        open={mobileFilter}
        onClose={closeFilters}
        resultCount={filtered.length}
        onReset={resetFilters}
        canReset={canReset}
        {...panelProps}
      />

      <Toast toast={toast} />
    </main>
  );
}