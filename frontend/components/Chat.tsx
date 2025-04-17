import { useState, useRef, useEffect } from "react";
import { Send, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ChatMessage from "./ChatMessage";
import { useChat } from "./hooks/useChat";
import { Item } from "./ItemCard";

interface ChatProps {
  onResultsFound: (items: Item[]) => void;
}

export default function Chat({ onResultsFound }: ChatProps) {
  const [inputValue, setInputValue] = useState("");
  const { messages, loading, results, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Update parent component with results when they change
  useEffect(() => {
    if (results.length > 0) {
      onResultsFound(results);
    }
  }, [results, onResultsFound]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus input when opening chat
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <Button
        onClick={toggleChat}
        className="rounded-full h-12 w-12 shadow-lg"
        size="icon"
      >
        {isOpen ? <X /> : <Send />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 md:w-96 shadow-xl animate-in slide-in-from-bottom-5">
          <CardHeader className="p-3 border-b flex flex-row justify-between items-center">
            <h3 className="font-medium text-sm">Product Assistant</h3>
            <Button variant="ghost" size="sm" onClick={clearChat}>
              Clear
            </Button>
          </CardHeader>
          <CardContent className="p-3 h-80 overflow-y-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about products..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
