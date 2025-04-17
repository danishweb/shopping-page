"use client";
import { useState } from "react";
import ItemCard from "../components/ItemCard";
import Cart from "../components/Cart";
import SearchBar from "../components/SearchBar";
import Chat from "../components/Chat";
import { Skeleton } from "@/components/ui/skeleton";

import { useItems } from "@/components/hooks/useItems";
import { useCartActions, useCartPersistence, useCartStore } from "@/components/hooks/useCart";
import { Item } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  useCartPersistence();
  const [search, setSearch] = useState("");
  const { items, loading, error } = useItems(search);
  const cart = useCartStore((state) => state.cart);
  const { addToCart: addCart, removeFromCart: removeCart } = useCartActions();
  const [chatResults, setChatResults] = useState<Item[]>([]);
  const [showingChatResults, setShowingChatResults] = useState(false);

  const handleAddToCart = (item: Item) => {
    addCart(item);
  };

  const handleRemoveFromCart = (sku: string) => {
    removeCart(sku);
  };

  const handleChatResults = (results: Item[]) => {
    setChatResults(results);
    setShowingChatResults(true);
    // Clear the search input when showing chat results
    setSearch("");
  };

  // Reset to normal search mode
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setShowingChatResults(false);
  };

  // Determine which items to display
  const displayItems = showingChatResults ? chatResults : items;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Karini AI Store</h1>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>
        {showingChatResults && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowingChatResults(false)}
            className="whitespace-nowrap"
          >
            Clear Chat Results
          </Button>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {showingChatResults && (
        <div className="mb-4 p-2 bg-muted rounded-md">
          <p className="text-sm">
            Showing {chatResults.length} results from chat query
          </p>
        </div>
      )}

      <div className="flex gap-6">
        {/* Items Section */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          <div className="h-[70vh] overflow-y-auto pr-2">
            <ul className="list-none p-0 m-0">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <li key={i} className="mb-4">
                      <div className="flex flex-row items-center gap-4 p-3 bg-accent rounded-lg">
                        <Skeleton className="w-20 h-20 rounded" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-2/3" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded" />
                      </div>
                    </li>
                  ))
                : displayItems.map((item, idx) => (
                    <ItemCard
                      key={item["Variant SKU"] + "-" + idx}
                      item={item}
                      inCart={cart.some((c) => c.sku === item["Variant SKU"])}
                      onAdd={handleAddToCart}
                    />
                  ))}
            </ul>
          </div>
        </div>
        {/* Cart Section (Sticky) */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-8">
            <Cart cart={cart} onRemove={handleRemoveFromCart} />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Chat onResultsFound={handleChatResults} />
    </div>
  );
}
