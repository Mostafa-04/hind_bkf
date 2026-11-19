import { useEffect } from "react";
import {
    FaTimes,
    FaPlus,
    FaMinus,
    FaTrash,
    FaShoppingBag,
    FaWhatsapp,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const WHATSAPP_NUMBER = "212707748943";

const formatPrice = (n) => `${Number(n).toLocaleString("fr-MA")} DH`;

export default function CartPage({ open, onClose }) {
    const { cartItems, updateQuantity, removeFromCart, totalItems, totalPrice } =
        useCart();

    useEffect(() => {
        if (!open) return;

        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    const handleWhatsAppOrder = () => {
        const lines = cartItems.map(
            (item) =>
                `• ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
        );

        const message = [
            "Bonjour, je souhaite passer commande :",
            "",
            ...lines,
            "",
            `Total : ${formatPrice(totalPrice)}`,
            "",
            "Merci de me confirmer la disponibilité et les frais de livraison.",
        ].join("\n");

        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        onClose();
        navigate("/checkout");
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] transition-[opacity,visibility] duration-300 ${
                    open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
                }`}
            />

            {/* Drawer */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Mon panier"
                aria-hidden={!open}
                className={`fixed right-0 top-0 z-[101] flex h-[100dvh] w-full flex-col bg-[#F8F5EF] shadow-2xl transition-[transform,visibility] duration-500 ease-in-out sm:max-w-[450px] ${
                    open ? "visible translate-x-0" : "invisible translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#29251F]/10 px-6 py-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B18A32]">
                            LUBAN
                        </span>
                        <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
                            Mon panier
                            <span className="ml-2 text-sm text-[#B18A32]">
                                ({totalItems})
                            </span>
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#29251F]/10 transition hover:bg-[#D4A638] hover:text-white"
                        aria-label="Fermer le panier"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Products */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {cartItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <FaShoppingBag className="mb-6 text-4xl text-[#D4A638]/60" />
                            <h3 className="font-serif text-2xl text-[#29251F]">
                                Votre panier est vide
                            </h3>
                            <p className="mt-3 text-sm text-[#29251F]/50">
                                Découvrez nos encens, parfums et créations artisanales.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-7 bg-[#29251F] px-7 py-4 text-xs uppercase tracking-widest text-white transition hover:bg-[#D4A638]"
                            >
                                Continuer mes achats
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex gap-4 border-b border-[#29251F]/10 pb-6"
                                >
                                    <Link
                                        to={`/product/${item.id}`}
                                        onClick={onClose}
                                        className="h-28 w-24 shrink-0 overflow-hidden bg-[#F0ECE5]"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    </Link>

                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-[#B18A32]">
                                                {item.category}
                                            </p>
                                            <Link
                                                to={`/product/${item.id}`}
                                                onClick={onClose}
                                                className="mt-1 block truncate font-serif text-lg text-[#29251F] hover:text-[#B18A32]"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="mt-1 text-sm font-semibold text-[#B18A32]">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center border border-[#29251F]/15">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    }
                                                    disabled={item.quantity <= 1}
                                                    className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                                                    aria-label={`Diminuer la quantité de ${item.name}`}
                                                >
                                                    <FaMinus size={9} />
                                                </button>

                                                <span className="w-8 text-center text-xs">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity + 1)
                                                    }
                                                    disabled={item.quantity >= 99}
                                                    className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                                                    aria-label={`Augmenter la quantité de ${item.name}`}
                                                >
                                                    <FaPlus size={9} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-[#29251F]/35 transition hover:text-red-500"
                                                aria-label={`Supprimer ${item.name} du panier`}
                                            >
                                                <FaTrash size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-[#29251F]/10 bg-[#F8F5EF] px-6 py-6">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm text-[#29251F]/60">Articles</span>
                            <span className="text-sm font-semibold">{totalItems}</span>
                        </div>

                        <div className="mb-3 flex items-center justify-between">
                            <span className="font-serif text-xl text-[#29251F]">Sous-total</span>
                            <span className="text-xl font-bold text-[#B18A32]">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>

                        <p className="mb-5 text-[10px] text-[#29251F]/40">
                            Frais de livraison communiqués lors de la confirmation de votre commande.
                        </p>

                        <button
                            onClick={handleCheckout}
                            className="flex w-full items-center justify-center gap-3 bg-[#D4A638] py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1F1A14] transition hover:bg-[#B18A32]"
                        >
                            <FaShoppingBag size={16} />
                            Passer la commande
                        </button>

                        <button
                            onClick={onClose}
                            className="mt-5 w-full text-center text-[10px] uppercase tracking-widest text-[#29251F]/50 transition hover:text-[#B18A32]"
                        >
                            Continuer mes achats
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}