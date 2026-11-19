
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Menu,
  X,
  Search,
  ShoppingBag,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import CartPage from "./CartPage";
import { categories } from "../data/categories";

const INSTAGRAM_URL = "https://www.instagram.com/luban_hindbkf/";
const WHATSAPP_URL = "https://wa.me/212707748943";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Boutique", href: "/shop" },
  { name: "À propos", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const iconBtn =
  "rounded text-[#F8F6F0] transition-colors hover:text-[#D4A638] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638]";

// Cart Button
function CartButton({ count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-10 w-10 items-center justify-center ${iconBtn}`}
      aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`}
    >
      <ShoppingBag size={20} strokeWidth={1.6} />

      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A638] text-[10px] font-bold text-[#111111]">
          {count}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const { totalItems } = useCart();
  const location = useLocation();

  // Close menus when navigating
  useEffect(() => {
    setIsOpen(false);
    setCollectionsOpen(false);
  }, [location.pathname, location.search]);

  // Lock body scroll when menu or cart is open
  useEffect(() => {
    document.body.style.overflow =
      isOpen || cartOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, cartOpen]);

  // Open cart
  const openCart = () => {
    setIsOpen(false);
    setCollectionsOpen(false);
    setCartOpen(true);
  };

  // Close cart
  const closeCart = () => {
    setCartOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#111111] text-[#F8F6F0] shadow-lg">

        {/* Announcement Bar */}
        <div className="bg-[#D4A638] px-4 py-2 text-center text-[11px] font-medium tracking-wider text-[#111111] sm:text-xs">
          ENCENS, PARFUMS & MODE • LIVRAISON PARTOUT AU MAROC ET À L'INTERNATIONAL
        </div>

        {/* Main Navbar */}
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
          aria-label="Navigation principale"
        >
          {/* Logo */}
          <Link
            to="/"
            className="group flex flex-col items-center"
            aria-label="Luban - Accueil"
          >
            <img
              src="/logo1.png"
              alt="Logo de Luban"
              width={50}
              height={60}
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">

            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium tracking-wide transition-colors hover:text-[#D4A638]"
              >
                {link.name}
              </Link>
            ))}

            {/* Collections Dropdown */}
            <div className="group relative">

              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium tracking-wide transition-colors hover:text-[#D4A638]"
                aria-haspopup="true"
              >
                Collections

                <ChevronDown
                  size={15}
                  className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                />
              </button>

              <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-64 -translate-x-1/2 translate-y-2 rounded-sm border border-[#D4A638]/20 bg-[#111111] p-2 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">

                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={category.href}
                    className="flex flex-col gap-1 border-b border-[#292929] px-4 py-3 last:border-0 hover:bg-[#D4A638]/10"
                  >
                    <span className="text-sm font-medium text-[#F8F6F0] transition-colors hover:text-[#D4A638]">
                      {category.name}
                    </span>

                    <span className="text-[9px] tracking-widest text-[#D4A638]/70">
                      {category.subtitle}
                    </span>
                  </Link>
                ))}

              </div>
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium tracking-wide transition-colors hover:text-[#D4A638]"
              >
                {link.name}
              </Link>
            ))}

          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 lg:flex">

            <Link
              to="/shop"
              aria-label="Rechercher des produits"
              className={iconBtn}
            >
              <Search size={19} strokeWidth={1.6} />
            </Link>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={iconBtn}
            >
              <FaInstagram size={19} strokeWidth={1.6} />
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={iconBtn}
            >
              <MessageCircle size={19} strokeWidth={1.6} />
            </a>

            <CartButton
              count={totalItems}
              onClick={openCart}
            />

          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">

            <CartButton
              count={totalItems}
              onClick={openCart}
            />

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded p-2 text-[#D4A638] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A638]"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <X size={26} />
              ) : (
                <Menu size={26} />
              )}
            </button>

          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-[#292929] bg-[#111111] px-6 py-6 lg:hidden"
          >
            <div className="flex flex-col gap-5">

              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="border-b border-[#292929] pb-3 text-sm tracking-wide transition-colors hover:text-[#D4A638]"
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Collections Dropdown */}
              <div className="border-b border-[#292929] pb-3">

                <button
                  type="button"
                  onClick={() =>
                    setCollectionsOpen((prev) => !prev)
                  }
                  className="flex w-full items-center justify-between text-sm tracking-wide transition-colors hover:text-[#D4A638]"
                  aria-expanded={collectionsOpen}
                >
                  Collections

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      collectionsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {collectionsOpen && (
                  <div className="mt-4 flex flex-col gap-4 pl-4">

                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={category.href}
                        onClick={() => {
                          setIsOpen(false);
                          setCollectionsOpen(false);
                        }}
                        className="flex flex-col gap-1"
                      >
                        <span className="text-sm text-[#F8F6F0] transition-colors hover:text-[#D4A638]">
                          {category.name}
                        </span>

                        <span className="text-[9px] tracking-widest text-[#D4A638]/70">
                          {category.subtitle}
                        </span>
                      </Link>
                    ))}

                  </div>
                )}

              </div>

              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="border-b border-[#292929] pb-3 text-sm tracking-wide transition-colors hover:text-[#D4A638]"
                >
                  {link.name}
                </Link>
              ))}

              {/* Social Media */}
              <div className="flex justify-center gap-8 pt-2 text-[#D4A638]">

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram size={22} strokeWidth={1.6} />
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={22} strokeWidth={1.6} />
                </a>

              </div>

            </div>
          </div>
        )}

      </header>

      {/* Cart Drawer */}
      <CartPage
        open={cartOpen}
        onClose={closeCart}
      />
    </>
  );
}
