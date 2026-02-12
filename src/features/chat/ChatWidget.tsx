import { useState, useRef, useEffect } from "react";
import { useWebSocketChat } from "../../hooks/useWebSocketChat";
import { ChatMessage } from "./ChatMessage";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, connectionStatus, hasReceivedFirstMessage, sendMessage, connect, isConnected } = useWebSocketChat();

  useEffect(() => {
    if (isOpen && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const send = () => {
    if (!input.trim() || !isConnected) return;
    sendMessage(input);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const statusText = () => {
    if (connectionStatus === "connecting") return "Connecting…";
    if (connectionStatus === "connected") return hasReceivedFirstMessage ? "Connected" : "Connecting…";
    if (connectionStatus === "disconnected") return "Disconnected";
    if (connectionStatus === "error") return "Connection Error";
    return "";
  };

  const statusColor = () => {
    if (connectionStatus === "connected" && hasReceivedFirstMessage) return "text-green-600";
    if (connectionStatus === "connecting") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {messages.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{messages.length > 9 ? "9+" : messages.length}</span>}
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
              <h3 className="font-semibold">Live Chat</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-indigo-700 rounded-full p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={`px-4 py-2 text-xs font-medium border-b ${statusColor()} bg-gray-50`}>
            {connectionStatus === "connecting" && <span className="animate-spin mr-1">⏳</span>}
            {statusText()}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <p>No messages yet</p>
                <p className="text-xs mt-1">Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
            )}
            <div ref={endRef} />
          </div>

          {connectionStatus === "disconnected" && (
            <div className="px-4 py-3 bg-red-50 border-t border-red-200 flex items-center justify-between">
              <span className="text-sm text-red-800 font-medium">Connection lost</span>
              <button onClick={connect} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg">Reconnect</button>
            </div>
          )}

          <div className="p-4 border-t bg-white rounded-b-2xl flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKey}
              placeholder={isConnected ? "Type a message..." : "Waiting for connection..."}
              disabled={!isConnected}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button onClick={send} disabled={!isConnected || !input.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2">
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
