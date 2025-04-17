import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X } from "lucide-react";
import { CartItem } from "./hooks/useCart";

interface CartProps {
  cart: CartItem[];
  onRemove: (sku: string) => void;
}

export default function Cart({ cart, onRemove }: CartProps) {
  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <Card className="p-4">
      <CardHeader className="p-0 mb-2">
        <h2 className="text-lg font-semibold">Cart</h2>
      </CardHeader>
      <CardContent className="p-0">
        {cart.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <div>
            <ul className="list-none p-0 space-y-3 max-h-[50vh] overflow-y-auto">
              {cart.map((item) => (
                <li key={item.sku} className="border-b pb-2">
                  <div className="flex items-start gap-2">
                    {/* Image */}
                    {item.imageSrc ? (
                      <div className="w-10 h-10 rounded overflow-hidden flex items-center justify-center bg-muted">
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          width={40}
                          height={40}
                          className="object-cover"
                          style={{ objectFit: "cover" }}
                          unoptimized // Remove if domain is added to next.config.js
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.style.display = "none"; }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                    
                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      <Badge variant="outline" className="mt-1">${item.price}</Badge>
                    </div>
                    
                    {/* Remove button */}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6" 
                      onClick={() => onRemove(item.sku)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Cart summary */}
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-3">Checkout</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
