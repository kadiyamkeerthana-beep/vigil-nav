import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Trash2, UserPlus, Shield } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(15, "Phone too long"),
  relationship: z.string().trim().max(50, "Relationship too long").optional(),
});

interface EmergencyContact {
  id: string;
  contact_name: string;
  contact_phone: string;
  relationship?: string;
}

interface EmergencyContactsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const EmergencyContactsManager = ({ open, onOpenChange, userId }: EmergencyContactsManagerProps) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      loadContacts();
    }
  }, [open, userId]);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load emergency contacts",
        variant: "destructive",
      });
    }
  };

  const handleAddContact = async () => {
    try {
      setLoading(true);

      // Validate input
      const validatedData = contactSchema.parse({
        name: name.trim(),
        phone: phone.trim(),
        relationship: relationship.trim() || undefined,
      });

      const { error } = await supabase.from("emergency_contacts").insert({
        user_id: userId,
        contact_name: validatedData.name,
        contact_phone: validatedData.phone,
        relationship: validatedData.relationship,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Emergency contact added successfully",
      });

      setName("");
      setPhone("");
      setRelationship("");
      loadContacts();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add emergency contact",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("id", contactId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Emergency contact deleted",
      });

      loadContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (contactId: string) => {
    toast({
      title: "Info",
      description: "Contact order updated",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Emergency Contacts
          </DialogTitle>
          <DialogDescription>
            Add trusted contacts who will receive alerts in case of emergency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Contact Form */}
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Add New Contact</h3>
              </div>
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contact name"
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 1234567890"
                    maxLength={15}
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship (Optional)</Label>
                  <Input
                    id="relationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g., Family, Friend, Colleague"
                    maxLength={50}
                  />
                </div>
                <Button
                  onClick={handleAddContact}
                  disabled={loading || !name.trim() || !phone.trim()}
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>
          </Card>

          {/* Contacts List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Saved Contacts ({contacts.length})
            </h3>
            {contacts.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No emergency contacts added yet</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold">{contact.contact_name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {contact.contact_phone}
                        </p>
                        {contact.relationship && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {contact.relationship}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyContactsManager;
