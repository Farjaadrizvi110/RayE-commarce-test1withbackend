import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg aspect-[4/3] bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {product.is_featured && (
            <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {product.description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">£{product.base_price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">from</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/products/${product.slug}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
