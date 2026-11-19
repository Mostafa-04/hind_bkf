
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import HeroSection from "./components/hero";
import CategoriesSection from "./components/CategoriesSection";
import BestSellersSection from "./components/BestSellersSection";
import BrandStorySection from "./components/BrandStorySection";
import FeaturedCollectionSection from "./components/FeaturedCollectionSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import InstagramGallerySection from "./components/InstagramGallerySection";

import ShopPage from "./components/ShopPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import NewsletterFooter from "./components/NewsletterFooter";
import CheckoutPage from "./components/CheckoutPage";
import CartPage from "./components/CartPage";
import { CartProvider } from "./context/CartContext";

function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <BestSellersSection />
      
      <FeaturedCollectionSection />
      <WhyChooseUsSection />
      <InstagramGallerySection />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
           <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>

        <NewsletterFooter />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
