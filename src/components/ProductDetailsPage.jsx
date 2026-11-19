import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaWhatsapp,
  FaMinus,
  FaPlus,
  FaCheck,
  FaChevronRight,
  FaTruck,
  FaUndo,
  FaShoppingBag,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import {
  getProductById,
  getRelatedProducts,
  getCategory,
  formatPrice,
  getDiscount,
  getWhatsAppUrl,
} from "../utils/products";

/* Chemin de la page panier : à adapter à ton routeur si besoin */
const CART_PATH = "/cart";

/* Animations :
   - entrée de la page (galerie puis infos),
   - fondu doux au changement d'image,
   - apparition des produits liés au défilement (CSS pur).
   Tout est désactivé si l'utilisateur préfère moins de mouvement. */
const animationStyles = `
  @keyframes pd-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes pd-fade {
    from { opacity: 0; transform: scale(1.02); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes pd-pop {
    0%   { transform: scale(.6); opacity: 0; }
    70%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); }
  }
  .pd-rise { animation: pd-rise .7s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
  .pd-fade { animation: pd-fade .5s ease-out both; }
  .pd-pop  { animation: pd-pop .4s ease-out both; }

  @keyframes pd-reveal {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }
  @supports (animation-timeline: view()) {
    .pd-reveal {
      animation: pd-reveal linear both;
      animation-timeline: view();
      animation-range:
        entry calc(var(--i, 0) * 5%)
        entry calc(40% + var(--i, 0) * 5%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .pd-rise, .pd-fade, .pd-pop, .pd-reveal { animation: none; }
  }
`;

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF]";

/* Un seul badge : remise, puis nouveauté, puis best-seller */
const getBadge = (product) => {
  const discount = getDiscount(product.price, product.oldPrice);
  if (discount > 0) return `-${discount}%`;
  if (product.isNew) return "Nouveau";
  if (product.bestSeller) return "Best-seller";
  return null;
};

// ==========================================
// GALERIE
// ==========================================

function ProductGallery({ images, name, badge }) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="group relative aspect-[4/5] overflow-hidden bg-[#F0ECE5]">
        <img
          key={active}
          src={images[active]}
          alt={name}
          width={800}
          height={1000}
          fetchpriority={active === 0 ? "high" : undefined}
          decoding="async"
          className="pd-fade h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-105"
        />

        {badge && (
          <span className="absolute left-4 top-4 bg-[#D4A638] px-3 py-1.5 text-xs font-semibold text-[#1F1A14] sm:left-5 sm:top-5">
            {badge}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div
          role="group"
          aria-label="Images du produit"
          className="grid auto-cols-[calc(25%-0.4rem)] grid-flow-col gap-2 overflow-x-auto sm:gap-3"
        >
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Voir l'image ${index + 1}`}
              aria-current={active === index}
              className={`aspect-square overflow-hidden border-2 transition-colors duration-300 ${focusRing} ${
                active === index
                  ? "border-[#D4A638]"
                  : "border-transparent [@media(hover:hover)]:hover:border-[#D4A638]/50"
              }`}
            >
              <img
                src={image}
                alt=""
                width={160}
                height={160}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// QUANTITÉ
// ==========================================

function QuantitySelector({ quantity, setQuantity }) {
  const btn =
    "flex h-12 w-12 items-center justify-center text-[#29251F] transition-colors hover:bg-[#D4A638]/15 disabled:opacity-30 " +
    focusRing;

  return (
    <div>
      <p id="qty-label" className="mb-3 text-sm font-medium text-[#29251F]">
        Quantité
      </p>

      <div
        role="group"
        aria-labelledby="qty-label"
        className="flex w-fit items-center border border-[#29251F]/20 bg-white"
      >
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          aria-label="Diminuer la quantité"
          className={btn}
        >
          <FaMinus size={11} aria-hidden="true" />
        </button>

        <span aria-live="polite" className="w-14 text-center text-base font-semibold">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity(Math.min(99, quantity + 1))}
          disabled={quantity >= 99}
          aria-label="Augmenter la quantité"
          className={btn}
        >
          <FaPlus size={11} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// PRODUITS LIÉS
// ==========================================

function RelatedProducts({ items }) {
  return (
    <section
      aria-labelledby="related-title"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
    >
      <header className="pd-reveal mb-10 text-center sm:mb-14">
        <h2 id="related-title" className="font-serif text-3xl text-[#29251F] sm:text-4xl">
          Vous aimerez aussi
        </h2>
        <div aria-hidden="true" className="mx-auto mt-5 h-px w-14 bg-[#D4A638]" />
      </header>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
        {items.map((item, index) => {
          const image = item.image || item.images?.[0];
          const category = getCategory(item.category)?.name;

          return (
            <li key={item.id} className="pd-reveal" style={{ "--i": index }}>
              <Link to={`/product/${item.id}`} className={`group block ${focusRing}`}>
                <div className="aspect-[4/5] overflow-hidden bg-[#F0ECE5]">
                  <img
                    src={image}
                    alt={item.name}
                    width={600}
                    height={750}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-105"
                  />
                </div>

                <div className="mt-4 text-center sm:mt-5">
                  {category && <p className="text-xs text-[#94701E]">{category}</p>}
                  <h3 className="mt-1.5 font-serif text-lg text-[#29251F] transition-colors duration-300 [@media(hover:hover)]:group-hover:text-[#94701E]">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-[#29251F]">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ==========================================
// PAGE PRODUIT
// ==========================================

function ProductView({ product }) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);

  const ctaRef = useRef(null);
  const sectionRef = useRef(null);

  const images = (product.images?.length ? product.images : [product.image]).filter(Boolean);
  const category = getCategory(product.category);
  const badge = getBadge(product);
  const discount = getDiscount(product.price, product.oldPrice);
  const total = product.price * quantity;
  const related = getRelatedProducts(product, 4);

  /* Remonter en haut à l'ouverture d'un produit */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* Barre d'achat mobile : visible seulement quand le bouton principal
     est sorti de l'écran et que l'on est encore dans la zone produit. */
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;

    let ctaVisible = true;
    let sectionVisible = true;
    const update = () => setShowBar(!ctaVisible && sectionVisible);

    const ctaObserver = new IntersectionObserver(([entry]) => {
      ctaVisible = entry.isIntersecting;
      update();
    });
    const sectionObserver = new IntersectionObserver(([entry]) => {
      sectionVisible = entry.isIntersecting;
      update();
    });

    if (ctaRef.current) ctaObserver.observe(ctaRef.current);
    if (sectionRef.current) sectionObserver.observe(sectionRef.current);

    return () => {
      ctaObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  /* Retour visuel après ajout au panier */
  useEffect(() => {
    if (!added) return undefined;
    const timer = setTimeout(() => setAdded(false), 2800);
    return () => clearTimeout(timer);
  }, [added]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
  };

  const addLabel = added ? "Ajouté au panier" : "Ajouter au panier";
  const AddIcon = added ? FaCheck : FaShoppingBag;

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#29251F]">
      <style>{animationStyles}</style>

      <section
        ref={sectionRef}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Galerie */}
          <div className="pd-rise lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={images} name={product.name} badge={badge} />
          </div>

          {/* Informations */}
          <div className="pd-rise flex flex-col" style={{ "--d": "150ms" }}>
            {/* Fil d'Ariane */}
            <nav aria-label="Fil d'Ariane" className="mb-6 sm:mb-8">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#29251F]/60">
                <li>
                  <Link to="/" className={`hover:text-[#94701E] ${focusRing}`}>Accueil</Link>
                </li>
                <FaChevronRight size={9} aria-hidden="true" />
                <li>
                  <Link to="/shop" className={`hover:text-[#94701E] ${focusRing}`}>Boutique</Link>
                </li>
                <FaChevronRight size={9} aria-hidden="true" />
                <li aria-current="page" className="max-w-[60vw] truncate text-[#94701E]">
                  {product.name}
                </li>
              </ol>
            </nav>

            {category && (
              <p className="mb-3 text-sm font-medium text-[#94701E]">{category.name}</p>
            )}

            <h1 className="text-balance font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* Prix */}
            <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 sm:mt-6">
              <span className="text-2xl font-semibold text-[#94701E]">
                {formatPrice(product.price)}
              </span>

              {product.oldPrice > product.price && (
                <>
                  <span className="text-lg text-[#29251F]/50 line-through">
                    <span className="sr-only">Ancien prix : </span>
                    {formatPrice(product.oldPrice)}
                  </span>
                  <span className="bg-[#D4A638]/20 px-3 py-1.5 text-sm font-medium text-[#6F5214]">
                    Vous économisez {discount}%
                  </span>
                </>
              )}
            </p>

            <div aria-hidden="true" className="my-7 h-px w-16 bg-[#D4A638] sm:my-8" />

            {product.description && (
              <p className="text-base leading-8 text-[#29251F]/75">{product.description}</p>
            )}

            {product.shortDescription && (
              <p className="mt-4 text-sm italic leading-7 text-[#29251F]/65">
                {product.shortDescription}
              </p>
            )}

            {/* Disponibilité */}
            {product.availability && (
              <p className="mt-7 flex items-center gap-3 border border-[#29251F]/10 bg-white p-4 text-sm text-[#29251F]/75 sm:mt-8">
                <span aria-hidden="true" className="h-2 w-2 flex-none rounded-full bg-[#D4A638]" />
                <span>
                  Disponibilité :
                  <strong className="ml-2 text-[#94701E]">{product.availability}</strong>
                </span>
              </p>
            )}

            <div className="mt-8">
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>

            {/* Total */}
            <div className="mt-8 flex items-center justify-between border-y border-[#29251F]/10 py-5">
              <span className="text-sm text-[#29251F]/70">Total estimé</span>
              <span aria-live="polite" className="text-xl font-semibold">
                {formatPrice(total)}
              </span>
            </div>

            {/* Actions */}
            <div ref={ctaRef} className="mt-7 space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex min-h-14 w-full items-center justify-center gap-3 bg-[#D4A638] px-6 py-4 text-sm font-semibold text-[#1F1A14] transition-colors duration-300 hover:bg-[#E5BD5D] ${focusRing}`}
              >
                <AddIcon
                  key={added ? "done" : "idle"}
                  size={17}
                  aria-hidden="true"
                  className={added ? "pd-pop" : ""}
                />
                {addLabel}
              </button>

              <a
                href={getWhatsAppUrl(product, quantity)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-14 w-full items-center justify-center gap-3 border border-[#1F1A14]/30 px-6 py-4 text-sm font-semibold text-[#1F1A14] transition-colors duration-300 hover:border-[#1F1A14] hover:bg-[#1F1A14] hover:text-white ${focusRing}`}
              >
                <FaWhatsapp size={18} aria-hidden="true" />
                Commander directement sur WhatsApp
              </a>
            </div>

            <div role="status" aria-live="polite">
              {added && (
                <p className="pd-rise mt-4 text-center text-sm text-[#29251F]/75">
                  Produit ajouté.{" "}
                  <Link
                    to={CART_PATH}
                    className={`font-semibold text-[#94701E] underline underline-offset-4 ${focusRing}`}
                  >
                    Voir mon panier
                  </Link>
                </p>
              )}
            </div>

            <p className="mt-4 text-center text-sm leading-6 text-[#29251F]/60">
              Votre commande est confirmée après vérification de la
              disponibilité et des modalités de livraison.
            </p>

            {/* Réassurance */}
            <ul className="mt-9 grid grid-cols-3 gap-3 border-t border-[#29251F]/10 pt-8">
              {[
                { icon: FaTruck, label: "Livraison à confirmer" },
                { icon: FaWhatsapp, label: "Conseils par WhatsApp" },
                { icon: FaUndo, label: "Retour à confirmer" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="text-center">
                  <Icon aria-hidden="true" className="mx-auto mb-3 text-xl text-[#D4A638]" />
                  <p className="text-xs leading-5 text-[#29251F]/70 sm:text-sm">{label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && <RelatedProducts items={related} />}

      {/* Barre d'achat mobile */}
      <div
        aria-hidden={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#29251F]/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="leading-tight">
            <span className="block max-w-[9rem] truncate text-xs text-[#29251F]/65">
              {product.name}
            </span>
            <span className="text-lg font-semibold text-[#94701E]">{formatPrice(total)}</span>
          </div>

          <button
            type="button"
            tabIndex={showBar ? 0 : -1}
            onClick={handleAddToCart}
            className={`flex min-h-12 flex-1 items-center justify-center gap-2 bg-[#D4A638] px-4 text-sm font-semibold text-[#1F1A14] transition-colors active:bg-[#E5BD5D] ${focusRing}`}
          >
            <AddIcon size={16} aria-hidden="true" />
            {addLabel}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = getProductById(id);

  if (!product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F8F5EF] px-6 text-center">
        <style>{animationStyles}</style>
        <div className="pd-rise flex flex-col items-center">
          <h1 className="font-serif text-3xl text-[#29251F]">Produit introuvable</h1>
          <p className="mt-4 max-w-xs text-sm text-[#29251F]/70">
            Ce produit n'existe pas ou n'est plus disponible.
          </p>
          <Link
            to="/shop"
            className={`mt-7 inline-flex min-h-12 items-center bg-[#D4A638] px-8 py-4 text-sm font-semibold text-[#1F1A14] transition-colors hover:bg-[#E5BD5D] ${focusRing}`}
          >
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  /* key : réinitialise quantité, galerie et état quand on change de produit */
  return <ProductView key={product.id} product={product} />;
}