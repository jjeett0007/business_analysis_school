import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, CheckCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Escalation {
  id: string;
  name: string;
  email: string;
  message: string;
  sessionId: string;
  timestamp: string;
  status: 'Open' | 'In Progress' | 'Closed';
  chatHistory?: any[];
}

const Admin = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadEscalations();
  }, []);

  const loadEscalations = () => {
    const stored = localStorage.getItem('escalations');
    if (stored) {
      setEscalations(JSON.parse(stored));
    }
  };

  const updateEscalationStatus = (id: string, status: Escalation['status']) => {
    const updated = escalations.map(escalation =>
      escalation.id === id ? { ...escalation, status } : escalation
    );
    setEscalations(updated);
    localStorage.setItem('escalations', JSON.stringify(updated));
    
    toast({
      title: "Status updated",
      description: `Escalation marked as ${status.toLowerCase()}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'In Progress': return 'default';
      case 'Closed': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6">
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-2xl">Student Support Escalations</CardTitle>
                <p className="text-muted-foreground">
                  Manage incoming human support requests from the AI assistant.
                </p>
              </div>
              <Badge variant="outline">
                {escalations.filter(e => e.status === 'Open').length} Open
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {escalations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No escalations yet</h3>
                <p className="text-muted-foreground">
                  Support requests will appear here when users need human assistance.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escalations.map((escalation) => (
                    <TableRow key={escalation.id}>
                      <TableCell className="font-medium">{escalation.name}</TableCell>
                      <TableCell>{escalation.email}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {escalation.message || "No additional details"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {escalation.sessionId.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(escalation.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(escalation.status)}>
                          {escalation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedEscalation(escalation)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Escalation Details</DialogTitle>
                              </DialogHeader>
                              {selectedEscalation && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Contact Information</h4>
                                      <p><strong>Name:</strong> {selectedEscalation.name}</p>
                                      <p><strong>Email:</strong> {selectedEscalation.email}</p>
                                      <p><strong>Date:</strong> {formatDate(selectedEscalation.timestamp)}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Session Details</h4>
                                      <p><strong>Session ID:</strong> {selectedEscalation.sessionId}</p>
                                      <p><strong>Status:</strong> {selectedEscalation.status}</p>
                                    </div>
                                  </div>
                                  
                                  {selectedEscalation.message && (
                                    <div>
                                      <h4 className="font-semibold">Additional Message</h4>
                                      <p className="bg-muted p-3 rounded-md">{selectedEscalation.message}</p>
                                    </div>
                                  )}
                                  
                                  {selectedEscalation.chatHistory && (
                                    <div>
                                      <h4 className="font-semibold">Chat History</h4>
                                      <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto space-y-3">
                                        {selectedEscalation.chatHistory.map((msg: any, index: number) => (
                                          <div key={index} className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                              msg.type === 'user' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-background'
                                            }`}>
                                              <p className="whitespace-pre-line">{msg.content}</p>
                                              <p className="text-xs opacity-70 mt-1">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {escalation.status !== 'Closed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateEscalationStatus(escalation.id, 'Closed')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;