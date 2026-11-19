import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { SITE } from "../config/site";
import { formatPrice } from "../utils/products";
import {
  MessageCircle,
  ArrowLeft,
  ShoppingBag,
  ChevronDown,
  Loader2,
} from "lucide-react";

/* Une seule animation d'entrée, désactivée si l'utilisateur
   préfère moins de mouvement. */
const animationStyles = `
  @keyframes cko-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: none; }
  }
  .cko-rise {
    animation: cko-rise .6s cubic-bezier(.2,.7,.2,1) both;
    animation-delay: var(--d, 0ms);
  }
  @media (prefers-reduced-motion: reduce) {
    .cko-rise { animation: none; }
  }
`;

const PHONE_REGEX = /^(?:\+212|00212|0)[5-7]\d{8}$/;

const inputBase =
  "w-full rounded-md border bg-white px-4 py-3 text-base text-[#1F1A14] " +
  "placeholder:text-gray-400 outline-none transition-[border-color,box-shadow] duration-200 " +
  "focus:border-[#D4A638] focus:ring-2 focus:ring-[#D4A638]/25";

function Field({ id, label, required, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#1F1A14]">
        {label}
        {required && <span className="text-[#A47C20]"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { cartItems, totalPrice } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 3) next.fullName = "Entrez votre nom complet.";
    if (!PHONE_REGEX.test(form.phone.replace(/[\s.-]/g, "")))
      next.phone = "Numéro invalide. Exemple : 06 12 34 56 78.";
    if (!form.city.trim()) next.city = "Indiquez votre ville.";
    if (form.address.trim().length < 6) next.address = "Ajoutez votre adresse complète.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cartItems.length || sending || !validate()) return;

    const orderDetails = cartItems
      .map((item) => {
        const name = item.name || item.title;
        return [
          `• ${name}`,
          `Quantité : ${item.quantity}`,
          `Prix : ${formatPrice(item.price)}`,
          `Total : ${formatPrice(item.price * item.quantity)}`,
        ].join("\n");
      })
      .join("\n\n");

    const message = [
      `🛍️ *Nouvelle commande - ${SITE.name || "Luban BK"}*`,
      "",
      "*Informations client*",
      `Nom : ${form.fullName.trim()}`,
      `Téléphone : ${form.phone.trim()}`,
      `Email : ${form.email.trim() || "Non renseigné"}`,
      `Ville : ${form.city.trim()}`,
      `Adresse : ${form.address.trim()}`,
      "",
      "*Détails de la commande*",
      orderDetails,
      "",
      `*Total : ${formatPrice(totalPrice)}*`,
      "Livraison à confirmer.",
    ].join("\n");

    const url = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

    setSending(true);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => setSending(false), 2500);
  };

  const fieldClass = (name) =>
    `${inputBase} ${errors[name] ? "border-red-400" : "border-[#e5dfd3]"}`;

  const aria = (name) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  /* Panier vide */
  if (!cartItems.length) {
    return (
      <main className="flex min-h-[65vh] flex-col items-center justify-center bg-[#F8F5EF] px-4 text-center">
        <style>{animationStyles}</style>
        <div className="cko-rise flex flex-col items-center">
          <ShoppingBag size={44} className="mb-4 text-[#D4A638]" aria-hidden="true" />
          <h1 className="mb-2 font-serif text-2xl text-[#1F1A14]">Votre panier est vide</h1>
          <p className="mb-6 max-w-xs text-sm text-gray-500">
            Ajoutez des produits depuis la boutique pour passer commande.
          </p>
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center bg-[#D4A638] px-6 py-3 font-medium text-[#1F1A14] transition-colors hover:bg-[#c29630] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F1A14] focus-visible:ring-offset-2"
          >
            Découvrir la boutique
          </Link>
        </div>
      </main>
    );
  }

  /* Récapitulatif (réutilisé : repliable sur mobile, fixe sur desktop) */
  const summaryItems = (
    <ul className="space-y-5">
      {cartItems.map((item) => (
        <li key={item.id} className="flex gap-4">
          <img
            src={item.image || item.images?.[0]}
            alt={item.name || item.title}
            width={64}
            height={80}
            loading="lazy"
            className="h-20 w-16 flex-none rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-[#1F1A14]">{item.name || item.title}</h3>
            <p className="mt-1 text-xs text-gray-500">Quantité : {item.quantity}</p>
            <p className="mt-2 text-sm font-semibold">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <main className="min-h-screen bg-[#F8F5EF] pb-32 pt-8 sm:pt-12 lg:pb-14 lg:pt-14">
      <style>{animationStyles}</style>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* En-tête */}
        <header className="cko-rise mb-8 sm:mb-10">
          <Link
            to="/shop"
            className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#1F1A14] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Retour à la boutique
          </Link>

          <h1 className="mb-2 font-serif text-3xl text-[#1F1A14] md:text-4xl">
            Valider ma commande
          </h1>
          <p className="max-w-xl text-sm text-gray-500 sm:text-base">
            Renseignez vos informations. Votre commande sera envoyée par WhatsApp
            pour confirmation de la disponibilité et de la livraison.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Récapitulatif : en premier sur mobile, à droite sur desktop */}
          <aside
            className="cko-rise order-first lg:order-last lg:col-span-2"
            style={{ "--d": "120ms" }}
          >
            <div className="rounded-xl bg-white p-5 sm:p-6 lg:sticky lg:top-24">
              {/* Bouton repliable (mobile uniquement) */}
              <button
                type="button"
                onClick={() => setSummaryOpen((o) => !o)}
                aria-expanded={summaryOpen}
                aria-controls="order-summary"
                className="flex w-full min-h-11 items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638] lg:pointer-events-none"
              >
                <span className="font-serif text-lg text-[#1F1A14] sm:text-xl">
                  Récapitulatif
                  <span className="ml-2 text-sm text-gray-500 lg:hidden">
                    ({cartItems.length} {cartItems.length > 1 ? "articles" : "article"})
                  </span>
                </span>
                <span className="flex items-center gap-2 lg:hidden">
                  <span className="font-semibold text-[#1F1A14]">{formatPrice(totalPrice)}</span>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`transition-transform duration-300 motion-reduce:transition-none ${
                      summaryOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {/* Zone animée : grid-rows 0fr → 1fr (pas de hauteur fixe) */}
              <div
                id="order-summary"
                className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none lg:grid-rows-[1fr] ${
                  summaryOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-5 lg:pt-6">{summaryItems}</div>
                </div>
              </div>

              <dl className="mt-5 space-y-3 border-t border-[#e5dfd3] pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Sous-total</dt>
                  <dd>{formatPrice(totalPrice)}</dd>
                </div>
                <div className="flex justify-between text-gray-500">
                  <dt>Livraison</dt>
                  <dd>À confirmer</dd>
                </div>
                <div className="flex items-center justify-between border-t border-[#e5dfd3] pt-4">
                  <dt className="font-semibold text-[#1F1A14]">Total</dt>
                  <dd className="font-serif text-2xl text-[#A47C20]">
                    {formatPrice(totalPrice)}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          {/* Formulaire */}
          <section
            className="cko-rise rounded-xl bg-white p-5 sm:p-8 lg:col-span-3"
            style={{ "--d": "220ms" }}
            aria-labelledby="form-title"
          >
            <h2 id="form-title" className="mb-1 font-serif text-xl text-[#1F1A14] sm:text-2xl">
              Informations de livraison
            </h2>
            <p className="mb-6 text-sm text-gray-500 sm:mb-7">
              Les champs marqués d'un * sont obligatoires.
            </p>

            <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-5">
              <Field id="fullName" label="Nom complet" required error={errors.fullName}>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Votre nom complet"
                  className={fieldClass("fullName")}
                  {...aria("fullName")}
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field id="phone" label="Téléphone" required error={errors.phone}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="06 00 00 00 00"
                    className={fieldClass("phone")}
                    {...aria("phone")}
                  />
                </Field>

                <Field id="email" label="Email" error={errors.email} hint="Facultatif">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                    className={fieldClass("email")}
                    {...aria("email")}
                  />
                </Field>
              </div>

              <Field id="city" label="Ville" required error={errors.city}>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  placeholder="Ex : Casablanca"
                  className={fieldClass("city")}
                  {...aria("city")}
                />
              </Field>

              <Field id="address" label="Adresse complète" required error={errors.address}>
                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={form.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  placeholder="Quartier, rue, numéro..."
                  className={`${fieldClass("address")} resize-none`}
                  {...aria("address")}
                />
              </Field>

              {/* Bouton desktop / tablette */}
              <button
                type="submit"
                disabled={sending}
                className="hidden w-full min-h-12 items-center justify-center gap-3 rounded-md bg-[#D4A638] py-4 font-semibold text-[#1F1A14] transition-colors duration-200 hover:bg-[#c29630] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F1A14] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 lg:flex"
              >
                {sending ? (
                  <Loader2 size={20} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                ) : (
                  <MessageCircle size={20} aria-hidden="true" />
                )}
                {sending ? "Ouverture de WhatsApp…" : "Confirmer sur WhatsApp"}
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* Barre d'action fixe sur mobile et tablette */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5dfd3] bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="leading-tight">
            <span className="block text-xs text-gray-500">Total</span>
            <span className="font-serif text-xl text-[#A47C20]">{formatPrice(totalPrice)}</span>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={sending}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-[#D4A638] px-4 font-semibold text-[#1F1A14] transition-colors active:bg-[#c29630] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F1A14] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
          >
            {sending ? (
              <Loader2 size={20} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <MessageCircle size={20} aria-hidden="true" />
            )}
            {sending ? "Ouverture…" : "Confirmer sur WhatsApp"}
          </button>
        </div>
      </div>
    </main>
  );
}