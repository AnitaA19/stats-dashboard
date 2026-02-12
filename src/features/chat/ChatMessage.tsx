import type { ChatMessage as ChatMessageType } from "../../types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const statusIcon = () => {
    if (message.status === "pending") {
      return (
        <svg className="w-3 h-3 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }
    if (message.status === "failed") {
      return (
        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  const colors = {
    message: "bg-white text-gray-900",
    system: "bg-blue-50 text-blue-900 border-blue-200",
    error: "bg-red-50 text-red-900 border-red-200",
  };

  return (
    <div className={`flex flex-col ${message.isOwn ? "ml-auto" : "mr-auto"} max-w-[80%] mb-2`}>
      <div className={`px-4 py-2 border shadow-sm ${colors[message.type]} ${message.isOwn ? "rounded-br-sm" : "rounded-bl-sm"} ${message.status === "pending" ? "opacity-60" : ""}`}>
        <p className="text-sm">{message.content}</p>
      </div>
      <div className={`flex items-center gap-1 px-2 mt-1 text-xs text-gray-500 ${message.isOwn ? "justify-end" : "justify-start"}`}>
        <span>{formatTime(message.timestamp)}</span>
        {statusIcon()}
      </div>
    </div>
  );
}
