import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">UK Print Pro</h3>
            <p className="text-sm opacity-90">
              Professional printing services for businesses across the UK. Quality prints, competitive prices, and exceptional customer service.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/products" className="block text-sm opacity-90 hover:opacity-100 hover:text-secondary transition-colors">
                Products
              </Link>
              <Link to="/quote" className="block text-sm opacity-90 hover:opacity-100 hover:text-secondary transition-colors">
                Request Quote
              </Link>
              <Link to="/gallery" className="block text-sm opacity-90 hover:opacity-100 hover:text-secondary transition-colors">
                Gallery
              </Link>
              <Link to="/contact" className="block text-sm opacity-90 hover:opacity-100 hover:text-secondary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <div className="space-y-2 text-sm opacity-90">
              <p>Business Cards & Stationery</p>
              <p>Large Format Printing</p>
              <p>Custom Packaging</p>
              <p>Promotional Items</p>
              <p>Finishing Services</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>123 Print Street, London, UK</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>020 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@ukprintpro.co.uk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-light text-center text-sm opacity-75">
          <p>{currentYear} UK Print Pro</p>
        </div>
      </div>
    </footer>
  );
}
