import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EscalationFormProps {
  onSubmit: (formData: { name: string; email: string; message: string }) => void;
  onCancel: () => void;
}

export const EscalationForm = ({ onSubmit, onCancel }: EscalationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Contact Human Support</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange('email')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Additional Details</Label>
            <Textarea
              id="message"
              placeholder="Optional details about your question..."
              value={formData.message}
              onChange={handleChange('message')}
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              Submit & Request Human Support
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};