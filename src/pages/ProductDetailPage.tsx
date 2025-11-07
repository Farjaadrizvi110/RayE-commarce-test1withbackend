import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/db/api";
import type { Product } from "@/types/types";
import { CheckCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState<Record<string, string | number>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;

    api.getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        if (data?.customization_options) {
          const initial: Record<string, string | number> = {};
          Object.entries(data.customization_options).forEach(([key, values]) => {
            if (Array.isArray(values) && values.length > 0) {
              initial[key] = values[0];
            }
          });
          setCustomization(initial);
        }
      })
      .catch((error) => console.error("Error loading product:", error))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      product,
      quantity,
      customization,
      price: product.base_price,
    });

    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => navigate("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image Available
                </div>
              )}
              {product.is_featured && (
                <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-primary">
                £{product.base_price.toFixed(2)}
              </span>
              <span className="text-muted-foreground">from</span>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {product.features && product.features.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {product.customization_options && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Customization Options</h3>
                  <div className="space-y-4">
                    {Object.entries(product.customization_options).map(([key, values]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium mb-2 capitalize">
                          {key.replace(/_/g, " ")}
                        </label>
                        <Select
                          value={String(customization[key] || "")}
                          onValueChange={(value) =>
                            setCustomization((prev) => ({ ...prev, [key]: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(values) &&
                              values.map((value) => (
                                <SelectItem key={String(value)} value={String(value)}>
                                  {String(value)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col xl:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Quantity:</label>
                <Select
                  value={String(quantity)}
                  onValueChange={(value) => setQuantity(Number(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 10].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
