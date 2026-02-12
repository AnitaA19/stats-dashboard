import { useState, useEffect, useRef, useCallback } from "react";
import { STORAGE_KEY, WS_URL } from "../config/constants";

export type ChatMessage = {
  id: string;
  type: string;
  content: string;
  timestamp: number;
  status: "pending" | "sent" | "failed";
  isOwn: boolean;
};

export function useWebSocketChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [hasReceivedFirstMessage, setHasReceivedFirstMessage] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const save = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  }, []);

  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    )
      return;

    setStatus("connecting");
    setHasReceivedFirstMessage(false);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        setHasReceivedFirstMessage(true);

        const incoming: ChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          type: data.type || "message",
          content: data.message,
          timestamp: data.timestamp || Date.now(),
          status: "sent",
          isOwn: false,
        };

        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.status === "pending" ? { ...m, status: "sent" as const } : m,
          );
          const final = [...updated, incoming];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
          return final;
        });
      } catch {
        console.error("Invalid message:", e.data);
      }
    };

    ws.onerror = () => setStatus("error");

    ws.onclose = () => {
      setStatus("disconnected");
      setHasReceivedFirstMessage(false);
    };
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const pending: ChatMessage = {
      id: `pending-${Date.now()}`,
      type: "message",
      content: content.trim(),
      timestamp: Date.now(),
      status: "pending",
      isOwn: true,
    };

    setMessages((prev) => {
      const updated = [...prev, pending];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(
          JSON.stringify({ type: "message", content: content.trim() }),
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pending.id ? { ...m, status: "failed" as const } : m,
          ),
        );
      }
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    messages,
    connectionStatus: status,
    hasReceivedFirstMessage,
    isConnected: status === "connected",
    sendMessage,
    connect,
    disconnect,
    clearMessages,
  };
}
