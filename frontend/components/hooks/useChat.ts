import { useState } from "react";
import { chatQuery } from "@/lib/api";
import { Item } from "../ItemCard";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "system";
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hello! How can I help you find products today? Try asking something like 'Show me products under $50' or 'Find SKU ABC123'.",
      sender: "system",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      // Send message to backend
      const response = await chatQuery(text);
      
      // Add system response
      const systemMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `I found ${response.data.length} items matching your query.`,
        sender: "system",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, systemMessage]);
      setResults(response.data);
    } catch (err) {
      console.error("Chat query error:", err);
      setError("Sorry, I couldn't process your request. Please try again.");
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: "system",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        text: "Hello! How can I help you find products today? Try asking something like 'Show me products under $50' or 'Find SKU ABC123'.",
        sender: "system",
        timestamp: new Date(),
      },
    ]);
    setResults([]);
    setError(null);
  };

  return {
    messages,
    loading,
    results,
    error,
    sendMessage,
    clearChat,
  };
}
