import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import QuotePage from "@/pages/QuotePage";
import GalleryPage from "@/pages/GalleryPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import ContactPage from "@/pages/ContactPage";
import type { ReactNode } from "react";

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: "Home",
    path: "/",
    element: <HomePage />,
  },
  {
    name: "Products",
    path: "/products",
    element: <ProductsPage />,
  },
  {
    name: "Product Detail",
    path: "/products/:slug",
    element: <ProductDetailPage />,
    visible: false,
  },
  {
    name: "Request Quote",
    path: "/quote",
    element: <QuotePage />,
  },
  {
    name: "Gallery",
    path: "/gallery",
    element: <GalleryPage />,
  },
  {
    name: "Contact",
    path: "/contact",
    element: <ContactPage />,
  },
  {
    name: "Cart",
    path: "/cart",
    element: <CartPage />,
    visible: false,
  },
  {
    name: "Checkout",
    path: "/checkout",
    element: <CheckoutPage />,
    visible: false,
  },
  {
    name: "Order Tracking",
    path: "/order-tracking",
    element: <OrderTrackingPage />,
    visible: false,
  },
];

export default routes;