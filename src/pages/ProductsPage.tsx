import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/products/ProductCard";
import { api } from "@/db/api";
import type { Product, Category } from "@/types/types";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedCategory = searchParams.get("category") || "all";

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch((error) => console.error("Error loading categories:", error));
  }, []);

  useEffect(() => {
    setLoading(true);
    const categorySlug = selectedCategory === "all" ? undefined : selectedCategory;
    api.getProducts(categorySlug)
      .then(setProducts)
      .catch((error) => console.error("Error loading products:", error))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-muted-foreground text-lg">
            Browse our comprehensive range of professional printing services
          </p>
        </div>

        <div className="mb-8 flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
          <div className="flex items-center gap-2 w-full xl:w-auto">
            <span className="text-sm font-medium">Filter by category:</span>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full xl:w-64">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products found in this category.</p>
            <Button onClick={() => handleCategoryChange("all")}>
              View All Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
