import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, Bot, User } from "lucide-react";
import { EscalationForm } from "@/components/EscalationForm";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  needsEscalation?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showEscalation, setShowEscalation] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initial greeting message
    const initialMessage: Message = {
      id: crypto.randomUUID(),
      type: 'assistant',
      content: `Hi there 👋, I'm your virtual support assistant.

I can help you with:
• Available programs
• Payment options  
• Career outcomes after graduation

What would you like to know today?`,
      timestamp: new Date()
    };
    setMessages([initialMessage]);

    // Handle initial message from landing page
    if (location.state?.initialMessage) {
      handleSendMessage(location.state.initialMessage);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): { content: string; needsEscalation: boolean } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses with some escalation triggers
    if (lowerMessage.includes('program') || lowerMessage.includes('course')) {
      return {
        content: "We offer comprehensive Business Analysis programs including:\n\n• Certified Business Analysis Professional (CBAP) prep\n• Agile Business Analysis certification\n• Data Analysis and Visualization\n• Requirements Management masterclass\n\nEach program includes hands-on projects, mentorship, and career support. Would you like details about any specific program?",
        needsEscalation: false
      };
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        content: "Our payment options are flexible:\n\n• Full payment: $2,999 (save 10%)\n• 3-month plan: $1,150/month\n• 6-month plan: $599/month\n• Income Share Agreement available\n\nWe also offer scholarships and corporate discounts. Would you like me to connect you with our admissions team for personalized pricing?",
        needsEscalation: Math.random() > 0.7 // 30% chance of escalation
      };
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('outcome')) {
      return {
        content: "Our graduates achieve excellent career outcomes:\n\n• 92% job placement rate within 6 months\n• Average salary increase: $25,000\n• Top employers: Microsoft, Amazon, JPMorgan Chase\n• Career support for 12 months post-graduation\n\nWould you like to speak with our career services team about your specific goals?",
        needsEscalation: Math.random() > 0.8 // 20% chance of escalation
      };
    }
    
    if (lowerMessage.includes('application') || lowerMessage.includes('apply') || lowerMessage.includes('enroll')) {
      return {
        content: "The application process is straightforward:\n\n1. Complete online application (15 minutes)\n2. Schedule a brief interview with our admissions team\n3. Submit any relevant work experience or education credentials\n4. Receive admission decision within 48 hours\n\nReady to start your application?",
        needsEscalation: false
      };
    }
    
    // Default response with higher escalation chance for complex queries
    return {
      content: "I'd be happy to help with that! However, I want to make sure you get the most accurate and detailed information for your specific situation.",
      needsEscalation: true
    };
  };

  const handleSendMessage = (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Generate AI response after a short delay
    setTimeout(() => {
      const { content, needsEscalation } = generateResponse(messageText);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content,
        timestamp: new Date(),
        needsEscalation
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (needsEscalation) {
        setTimeout(() => {
          const escalationMessage: Message = {
            id: crypto.randomUUID(),
            type: 'assistant',
            content: "I'm not fully confident about the answer to your question. Please leave your contact details, and a support agent will reach out shortly.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, escalationMessage]);
          setShowEscalation(true);
        }, 1000);
      }
    }, 1000);
  };

  const handleEscalationSubmit = (formData: { name: string; email: string; message: string }) => {
    // Store escalation in localStorage (in a real app, this would go to a backend)
    const escalations = JSON.parse(localStorage.getItem('escalations') || '[]');
    const newEscalation = {
      id: crypto.randomUUID(),
      ...formData,
      sessionId,
      timestamp: new Date().toISOString(),
      status: 'Open',
      chatHistory: messages
    };
    
    escalations.push(newEscalation);
    localStorage.setItem('escalations', JSON.stringify(escalations));
    
    setShowEscalation(false);
    
    const successMessage: Message = {
      id: crypto.randomUUID(),
      type: 'assistant',
      content: "Thank you! Your request has been sent. A support agent will reach out to you soon.",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, successMessage]);
    
    toast({
      title: "Request submitted",
      description: "A support agent will contact you shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6">
        <Card className="h-screen w-screen flex flex-col shadow-soft">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-xl">Business Analysis School Support</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ask us anything about our programs, payments, or career opportunities.
                </p>
              </div>
              <Badge variant="outline">Session: {sessionId.slice(0, 8)}</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {showEscalation && (
              <div className="border-t p-6">
                <EscalationForm 
                  onSubmit={handleEscalationSubmit}
                  onCancel={() => setShowEscalation(false)}
                />
              </div>
            )}

            <div className="border-t p-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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