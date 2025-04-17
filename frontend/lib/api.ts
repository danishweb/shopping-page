import { API_BASE } from "./apiBase";

export async function fetchItems(search?: string) {
  const url = search ? `${API_BASE}/api/items?search=${encodeURIComponent(search)}` : `${API_BASE}/api/items`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

export async function fetchItemBySku(sku: string) {
  const res = await fetch(`${API_BASE}/api/items/${sku}`);
  if (!res.ok) throw new Error("Item not found");
  return res.json();
}


export async function chatQuery(message: string) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Chat query failed");
  return res.json();
}
