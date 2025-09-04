import React, {
  useEffect,
  useState,
  ReactNode,
  useContext,
  createContext,
} from "react";

interface Message {
  reply?: string;
  isTyping?: boolean;
  needsEscalation?: boolean;
}

interface WebSocketContextType {
  ws: WebSocket | null;
  message: Message | null;
  setMessage: (message: Message | null) => void;   // <-- allow null
  setSessionId: (sessionId: string) => void;
  resetMessage: () => void;                        // <-- new
}

const webSocketContext = createContext<WebSocketContextType>({
  ws: null,
  message: null,
  setMessage: () => {},
  setSessionId: () => {},
  resetMessage: () => {},
});


export const useWebSocket = () => useContext(webSocketContext);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [sessionId, setSessionId] = useState<string>(""); // <-- track current sessionId

  const socketLink = `${import.meta.env.VITE_API_SOCKET_URL}`;

  useEffect(() => {
    if (!sessionId) return; // don’t connect if sessionId not set yet
    setMessage(null);

    const protocol = window.location.protocol === "https:" ? "wss" : "wss";
    const socket = new WebSocket(`${protocol}://${socketLink}`);

    socket.onopen = () => {
      // console.log("WebSocket connected with session:", sessionId);
      // send session ID immediately
      const initMsg = { type: "session-id", sessionId };
      socket.send(JSON.stringify(initMsg));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "session-ack" && data.sessionId !== "") {
        setWs(socket);
      }

      if (data.isTyping || data.isTyping === false || data.reply !== "") {
        setMessage(data);
      }
    };

    socket.onclose = () => {
      // console.log("WebSocket closed");
    };

    setWs(socket);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        // console.log("Cleanup: Closing WebSocket");
        socket.close();
      }
      setWs(null);
    };
  }, [socketLink, sessionId]); // <-- triggers on new sessionId

    const resetMessage = () => {
      setMessage(null)
    }; 

  return (
    <webSocketContext.Provider
      value={{ ws, message, setMessage, setSessionId, resetMessage }}
    >
      {children}
    </webSocketContext.Provider>
  );
};
