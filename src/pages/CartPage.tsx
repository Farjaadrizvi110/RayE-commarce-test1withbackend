import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const handleRemove = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success("Removed from cart", {
      description: `${productName} has been removed from your cart.`,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12">
        <div className="text-center max-w-md">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Start adding products to your cart to see them here
          </p>
          <Link to="/products">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your items before proceeding to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col xl:flex-row gap-4">
                    <div className="w-full xl:w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {item.product.name}
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1 mb-4">
                        {Object.entries(item.customization).map(([key, value]) => (
                          <div key={key}>
                            <span className="capitalize">{key.replace(/_/g, " ")}:</span>{" "}
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Quantity:</label>
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.product.id, Number(e.target.value))
                            }
                            className="border rounded px-3 py-1 text-sm"
                          >
                            {[1, 2, 3, 4, 5, 10, 15, 20].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          £{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemove(item.product.id, item.product.name)}
                          className="xl:ml-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>£{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">£{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout">
                  <Button size="lg" className="w-full mb-4">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                  className="w-full mt-4 text-destructive hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
