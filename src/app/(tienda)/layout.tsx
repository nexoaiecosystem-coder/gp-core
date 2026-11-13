import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddToCartToast } from "@/components/cart/AddToCartToast";
import { CartProvider } from "@/context/CartContext";
import { PriceOverridesProvider } from "@/context/PriceOverridesContext";

// Chrome de la tienda (header, carrito, footer).
export default function TiendaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PriceOverridesProvider>
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
        <CartDrawer />
        <AddToCartToast />
      </CartProvider>
    </PriceOverridesProvider>
  );
}
