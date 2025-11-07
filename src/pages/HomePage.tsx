import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/products/ProductCard";
import { api } from "@/db/api";
import type { Product, Category } from "@/types/types";
import { ArrowRight, CheckCircle, Printer, Truck, Award, Clock } from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getFeaturedProducts(), api.getCategories()])
      .then(([products, cats]) => {
        setFeaturedProducts(products);
        setCategories(cats);
      })
      .catch((error) => console.error("Error loading data:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary text-primary-foreground py-20 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl xl:text-6xl font-bold mb-6">
              Professional Printing Services for Your Business
            </h1>
            <p className="text-lg xl:text-xl mb-8 opacity-90">
              From business cards to large format banners, we deliver high-quality printing solutions across the UK
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="w-full xl:w-auto">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" variant="outline" className="w-full xl:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Request a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Printer className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  State-of-the-art printing technology for exceptional results
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast Turnaround</h3>
                <p className="text-sm text-muted-foreground">
                  Quick production times without compromising quality
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">UK-Wide Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Reliable shipping to anywhere in the United Kingdom
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated team to help with your printing needs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive printing solutions for all your business needs
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={`/products?category=${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <Button variant="link" className="p-0">
                        View Products <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Popular printing services chosen by our customers
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 xl:p-12 text-center">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4">
              Need a Custom Quote?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Have a specific project in mind? Get a personalized quote tailored to your requirements
            </p>
            <Link to="/quote">
              <Button size="lg" variant="secondary">
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4">Why Choose UK Print Pro?</h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Over 15 years of printing experience",
              "Competitive pricing with no hidden fees",
              "Eco-friendly printing options available",
              "Free design consultation service",
              "Satisfaction guarantee on all orders",
              "Secure online ordering system",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
