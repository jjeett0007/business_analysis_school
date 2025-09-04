import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, CheckCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/context/socketContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { escalateService } from "@/lib/api/service";
import { ApiResponse, escalationForms } from "@/lib/types";

// ---------- Interfaces ----------
interface Escalation {
  _id: string;
  sessionId: string;
  name: string;
  email: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
  updatedAt: string;
  chatHistory?: any[];
}

interface EscalationResponse {
  message: string;
  data: {
    results: Escalation[];
    pagination: {
      totalItems: number;
      currentPage: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

interface SessionMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

// ---------- Component ----------
const Admin = () => {
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetMessage } = useWebSocket();
  const queryClient = useQueryClient();

  // Fetch all escalations
  const {
    data: escalationData,
    isLoading: escalationLoading,
    error: escalationError,
  } = useQuery<ApiResponse<escalationForms>>({
    queryKey: ["escalations"],
    queryFn: escalateService.getAllEscalation,
    retry: 2,
  });

  const escalations = escalationData?.data?.results || [];

  // Reset message on leaving page
  useEffect(() => {
    return () => {
      resetMessage();
    };
  }, [resetMessage]);

  // Fetch escalation chat history by sessionId
  const {
    data: escalationBySessionId,
    isLoading: escalationSessionLoading,
    error: escalationSessionError,
  } = useQuery({
    queryKey: ["escalationBySessionId", selectedEscalation?.sessionId],
    queryFn: () =>
      selectedEscalation
        ? escalateService.getEscaltionBySessionId(selectedEscalation.sessionId)
        : Promise.resolve(null),
    enabled: !!selectedEscalation,
    retry: 2,
  });

  // Update escalation status
  const updateEscalationStatus = async (
    id: string,
    status: "open" | "in_progress" | "closed"
  ) => {
    try {
      // TODO: call API: await escalateService.updateEscalationStatus(id, status);
      queryClient.invalidateQueries({ queryKey: ["escalations"] });

      toast({
        title: "Status updated",
        description: `Escalation marked as ${status.replace("_", " ")}`,
      });

      // If currently viewing this escalation, also update locally
      if (selectedEscalation && selectedEscalation._id === id) {
        setSelectedEscalation((prev) =>
          prev ? { ...prev, status } : prev
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update escalation status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "destructive";
      case "in_progress":
        return "default";
      case "closed":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // ---------- Loading / Error states ----------
  if (escalationLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading escalations...</p>
        </div>
      </div>
    );
  }

  if (escalationError) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading escalations</p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["escalations"] })
            }
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6">
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  Student Support Escalations
                </CardTitle>
                <p className="text-muted-foreground">
                  Manage incoming human support requests from the AI assistant.
                </p>
              </div>
              <Badge variant="outline">
                {escalations.filter((e) => e.status === "open").length} Open
              </Badge>
              <Badge variant="secondary">
                Total: {escalationData?.data?.pagination?.totalItems || 0}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {escalations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No escalations yet</h3>
                <p className="text-muted-foreground">
                  Support requests will appear here when users need human
                  assistance.
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
                    <TableHead>Created At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escalations.map((escalation) => (
                    <TableRow key={escalation._id}>
                      <TableCell className="font-medium">{escalation.name}</TableCell>
                      <TableCell>{escalation.email}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={escalation.message}>
                          {escalation.message || "No additional details"}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {escalation.sessionId.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(escalation.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(escalation.status)}>
                          {getStatusDisplay(escalation.status)}
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
                                      <p>
                                        <strong>Name:</strong> {selectedEscalation.name}
                                      </p>
                                      <p>
                                        <strong>Email:</strong> {selectedEscalation.email}
                                      </p>
                                      <p>
                                        <strong>Created:</strong>{" "}
                                        {formatDate(selectedEscalation.createdAt)}
                                      </p>
                                      <p>
                                        <strong>Updated:</strong>{" "}
                                        {formatDate(selectedEscalation.updatedAt)}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Session Details</h4>
                                      <p>
                                        <strong>Session ID:</strong>{" "}
                                        {selectedEscalation.sessionId}
                                      </p>
                                      <p>
                                        <strong>Status:</strong>{" "}
                                        {getStatusDisplay(selectedEscalation.status)}
                                      </p>
                                      <p>
                                        <strong>ID:</strong> {selectedEscalation._id}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold">Message</h4>
                                    <p className="bg-muted p-3 rounded-md">
                                      {selectedEscalation.message}
                                    </p>
                                  </div>

                                  {escalationBySessionId?.data?.session?.messages?.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold">Chat History</h4>
                                      {escalationSessionLoading ? (
                                        <div className="bg-muted p-4 rounded-md flex items-center justify-center">
                                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                                          Loading chat history...
                                        </div>
                                      ) : (
                                        <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto space-y-3">
                                          {escalationBySessionId.data.session.messages.map(
                                            (msg: SessionMessage, index: number) => (
                                              <div
                                                key={index}
                                                className={`flex gap-2 ${
                                                  msg.role === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                                }`}
                                              >
                                                <div
                                                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                                    msg.role === "user"
                                                      ? "bg-primary text-primary-foreground"
                                                      : "bg-background"
                                                  }`}
                                                >
                                                  <p className="whitespace-pre-line">{msg.content}</p>
                                                  <p className="text-xs opacity-70 mt-1">
                                                    {new Date(
                                                      msg.createdAt
                                                    ).toLocaleTimeString()}
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        updateEscalationStatus(
                                          selectedEscalation._id,
                                          "in_progress"
                                        )
                                      }
                                      disabled={selectedEscalation.status === "in_progress"}
                                    >
                                      Mark as In Progress
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        updateEscalationStatus(
                                          selectedEscalation._id,
                                          "closed"
                                        )
                                      }
                                      disabled={selectedEscalation.status === "closed"}
                                    >
                                      Mark as Closed
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {escalation.status !== "closed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateEscalationStatus(escalation._id, "closed")
                              }
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
