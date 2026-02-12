export type MessageType = "message" | "system" | "error";
export type MessageStatus = "sent" | "pending" | "failed";

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: number;
  status?: MessageStatus;
  isOwn?: boolean;
}

export interface OutgoingMessage {
  type: "message";
  content: string;
}

export interface IncomingMessage {
  type: MessageType;
  message: string;
  timestamp?: number;
}

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";
