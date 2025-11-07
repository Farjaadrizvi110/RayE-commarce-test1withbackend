import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/db/api";
import type { GalleryItem } from "@/types/types";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGalleryItems()
      .then(setItems)
      .catch((error) => console.error("Error loading gallery:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Work Gallery</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our portfolio of successful printing projects for businesses across the UK
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No gallery items available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {item.category && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                      {item.category}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
