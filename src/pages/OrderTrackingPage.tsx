import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/db/api";
import type { Order } from "@/types/types";
import { Package, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import { toast } from "sonner";

const trackingSchema = z.object({
  order_number: z.string().min(5, "Please enter a valid order number"),
});

type TrackingFormData = z.infer<typeof trackingSchema>;

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      order_number: searchParams.get("order") || "",
    },
  });

  useEffect(() => {
    const orderNumber = searchParams.get("order");
    if (orderNumber) {
      handleTrackOrder(orderNumber);
    }
  }, [searchParams]);

  const handleTrackOrder = async (orderNumber: string) => {
    setLoading(true);
    try {
      const orderData = await api.getOrderByNumber(orderNumber);
      if (orderData) {
        setOrder(orderData);
      } else {
        toast.error("Order not found", {
          description: "Please check your order number and try again.",
        });
        setOrder(null);
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error("Failed to track order", {
        description: "Please try again later.",
      });
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: TrackingFormData) => {
    handleTrackOrder(data.order_number);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-secondary" />;
      case "processing":
        return <Package className="h-6 w-6 text-primary" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-primary" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-primary" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-secondary text-secondary-foreground",
      processing: "bg-primary text-primary-foreground",
      shipped: "bg-primary text-primary-foreground",
      delivered: "bg-primary text-primary-foreground",
      cancelled: "bg-destructive text-destructive-foreground",
    };

    return (
      <Badge className={variants[status] || "bg-muted text-muted-foreground"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">
            Enter your order number to check the status of your order
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                <FormField
                  control={form.control}
                  name="order_number"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter your order number (e.g., ORD-123456)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Tracking..." : "Track Order"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {order && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Details</CardTitle>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-semibold">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-semibold">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-semibold">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{order.customer_email}</p>
                  </div>
                </div>

                {order.shipping_address && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                    <p className="font-semibold">
                      {order.shipping_address.address_line1}
                      {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
                      <br />
                      {order.shipping_address.city}, {order.shipping_address.postcode}
                      <br />
                      {order.shipping_address.country}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-semibold text-lg capitalize">{order.status}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "pending" && "Your order has been received and is being processed"}
                      {order.status === "processing" && "Your order is currently being printed"}
                      {order.status === "shipped" && "Your order has been shipped and is on its way"}
                      {order.status === "delivered" && "Your order has been delivered"}
                      {order.status === "cancelled" && "This order has been cancelled"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-semibold">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        {Object.keys(item.customization).length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {Object.entries(item.customization).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between text-xl font-bold pt-4">
                    <span>Total</span>
                    <span className="text-primary">£{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
