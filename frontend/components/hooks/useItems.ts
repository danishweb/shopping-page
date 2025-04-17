import { useState, useEffect } from "react";
import { Item } from "../ItemCard";
import { fetchItems } from "@/lib/api";

export function useItems(search?: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchItems(search)
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  return { items, loading, error, setItems };
}
