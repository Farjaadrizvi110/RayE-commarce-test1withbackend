import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import routes from "@/routes";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const navigation = routes.filter((route) => route.visible !== false);

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">UK Print Pro</div>
          </Link>

          <div className="hidden xl:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-primary-light"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/cart">
              <Button variant="secondary" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          <button
            className="xl:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden py-4 border-t border-primary-light">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                  location.pathname === item.path
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-primary-light"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary-light"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
