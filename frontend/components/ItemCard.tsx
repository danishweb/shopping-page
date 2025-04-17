// Define a type for Item matching the fields used
export interface Item {
  Title: string;
  "Variant SKU": string;
  "Variant Price": number;
  "Image Src"?: string;
}

interface ItemCardProps {
  item: Item;
  inCart: boolean;
  onAdd: (item: Item) => void;
}

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ItemCard({ item, inCart, onAdd }: ItemCardProps) {
  return (
    <Card className="flex flex-row items-center gap-4 mb-4 p-3">
      {item["Image Src"] ? (
        <div className="w-20 h-20 rounded overflow-hidden flex items-center justify-center bg-muted">
          <Image
            src={item["Image Src"]}
            alt={item.Title}
            width={80}
            height={80}
            className="object-cover"
            style={{ objectFit: "cover" }}
            unoptimized // Remove this if you add the domain to next.config.js
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      ) : (
        <div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
          No Image
        </div>
      )}
      <div className="flex-1">
        <CardHeader className="p-0 mb-1">
          <div className="font-semibold text-base">{item.Title}</div>
        </CardHeader>
        <CardContent className="p-0 text-sm">
          <div className="text-muted-foreground">SKU: {item["Variant SKU"]}</div>
          <Badge className="mt-1">${item["Variant Price"]}</Badge>
        </CardContent>
      </div>
      <CardFooter className="p-0">
        <Button
          onClick={() => onAdd(item)}
          disabled={inCart}
          variant={inCart ? "secondary" : "default"}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
