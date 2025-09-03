import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, Bot, User, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/lib/api/service";
import { useWebSocket } from "@/context/socketContext";

interface Message {
  id: string;
  type: "user" | "assistant" | "escalation-form";
  content: string;
  timestamp: Date;
  needsEscalation?: boolean;
}

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 self-start">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="max-w-[80%] rounded-lg px-4 py-3 bg-gray-100">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            Assistant is typing...
          </span>
        </div>
      </div>
    </div>
  );
};

const EscalationFormComponent = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { name: string; email: string; message: string }) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-muted rounded-lg p-4 max-w-[80%]">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-2">
            Connect with a Support Agent
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Please provide your details so our team can assist you better.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Input
              placeholder="Your name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              className="text-sm"
            />
          </div>

          <div>
            <Input
              type="email"
              placeholder="Your email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="text-sm"
            />
          </div>

          <div>
            <Input
              placeholder="Additional details (optional)"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSubmit}
              type="submit"
              size="sm"
              className="text-xs"
            >
              Submit Request
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setSessionId, message } = useWebSocket();
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  useEffect(() => {
    setSessionId(sessionId);
  }, [sessionId, setSessionId]);

  useEffect(() => {
    if (message) {
      const { reply, needsEscalation, isTyping } = message;

      if (
        reply !== undefined ||
        isTyping !== undefined ||
        needsEscalation !== undefined
      ) {
        if (isTyping === true) {
          setIsAssistantTyping(true);
        }

        if (isTyping === false) {
          //hide typing state on the assistant side
          setIsAssistantTyping(false);
        }

        if (reply !== undefined && reply !== "" && needsEscalation === false) {
          setIsAssistantTyping(false);
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            type: "assistant",
            content: message.reply,
            timestamp: new Date(),
            needsEscalation: message.needsEscalation,
          };

          setMessages((prev) => [...prev, assistantMessage]);
        }

        if (
          reply !== undefined &&
          needsEscalation !== undefined &&
          reply !== "" &&
          needsEscalation === true
        ) {
          setTimeout(() => {
            setIsAssistantTyping(false);

            const escalationMessage: Message = {
              id: crypto.randomUUID(),
              type: "assistant",
              content: reply,
              timestamp: new Date(),
            };

            const escalationFormMessage: Message = {
              id: crypto.randomUUID(),
              type: "escalation-form",
              content: "",
              timestamp: new Date(),
            };

            setMessages((prev) => [
              ...prev,
              escalationMessage,
              escalationFormMessage,
            ]);
          }, 1000);
        }
      }
    }
  }, [message]);

  const { toast } = useToast();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.closest(".overflow-y-auto");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAssistantTyping]);

  const sendMessageMutation = useMutation({
    mutationFn: chatService.sendChat,
    onSuccess: (data) => {},
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create branch",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    sendMessageMutation.mutate({
      sessionId,
      content: messageText,
    });

    setMessages((prev) => [...prev, userMessage]);

    setInputValue("");
  };

  const handleEscalationSubmit = (formData: {
    name: string;
    email: string;
    message: string;
  }) => {
    // Remove the escalation form from messages
    setMessages((prev) => prev.filter((msg) => msg.type !== "escalation-form"));

    // Store escalation (removed localStorage usage as per instructions)
    const escalations = [];
    const newEscalation = {
      id: crypto.randomUUID(),
      ...formData,
      sessionId,
      timestamp: new Date().toISOString(),
      status: "Open",
      chatHistory: messages,
    };
    escalations.push(newEscalation);

    const successMessage: Message = {
      id: crypto.randomUUID(),
      type: "assistant",
      content: `Thank you, ${formData.name}! Your request has been sent to our support team. We'll reach out to you at ${formData.email} shortly.`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, successMessage]);

    toast({
      title: "Request submitted",
      description: "A support agent will contact you shortly.",
    });
  };

  const handleEscalationCancel = () => {
    // Remove the escalation form from messages
    setMessages((prev) => prev.filter((msg) => msg.type !== "escalation-form"));

    const cancelMessage: Message = {
      id: crypto.randomUUID(),
      type: "assistant",
      content: "No problem! Is there anything else I can help you with today?",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, cancelMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto px-4 py-6">
        <Card className="h-[85vh] w-full flex flex-col shadow-soft">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Button
                className="left w-content border"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-xl">
                  Business Analysis School Support
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ask us anything about our programs, payments, or career
                  opportunities.
                </p>
              </div>
              <Badge variant="outline">Session: {sessionId.slice(0, 8)}</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 max-h-full scroll-smooth"
              id="chat-container"
            >
              {messages.length === 0 && !isAssistantTyping && (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                  <Brain size={60} className="mb-4 text-blue-500" />
                  <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
                  <p className="text-gray-600 mb-1">
                    I can help you with Business Analysis School programs,
                    answer questions about payments, and more.
                  </p>
                  <p className="text-gray-500">
                    You can ask me anything related to business analysis school
                    programs, fees, or other program details.
                  </p>

                  {/* Demo buttons */}
                  <div className="mt-6 space-x-2">
                    <button
                      onClick={() =>
                        handleSendMessage("Tell me about your programs")
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Demo Message
                    </button>
                    <button
                      // onClick={triggerEscalation}
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Demo Escalation
                    </button>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {(message.type === "assistant" ||
                    message.type === "escalation-form") && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 self-start">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}

                  {message.type === "escalation-form" ? (
                    <EscalationFormComponent
                      onSubmit={handleEscalationSubmit}
                      onCancel={handleEscalationCancel}
                    />
                  ) : (
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.type === "user"
                          ? "bg-gradient-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  )}

                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isAssistantTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={() => handleSendMessage()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
