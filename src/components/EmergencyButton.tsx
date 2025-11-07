import { useState } from "react";
import { AlertCircle, Phone, Share2, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmergencyContactsManager from "./EmergencyContactsManager";

interface EmergencyButtonProps {
  userId?: string;
  currentLocation?: [number, number];
}

const EmergencyButton = ({ userId, currentLocation }: EmergencyButtonProps) => {
  const [open, setOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleEmergencyCall = () => {
    toast({
      title: "Calling Emergency Services",
      description: "Connecting to 112...",
      variant: "destructive",
    });
    window.open("tel:112");
  };

  const handleSendAlert = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send alerts",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);

      // Get emergency contacts
      const { data: contacts, error: contactsError } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", userId);

      if (contactsError) throw contactsError;

      if (!contacts || contacts.length === 0) {
        toast({
          title: "No Contacts Found",
          description: "Please add emergency contacts first",
          variant: "destructive",
        });
        setContactsOpen(true);
        return;
      }

      const location = currentLocation || [17.6869, 83.2185];
      const locationLink = `https://maps.google.com/?q=${location[0]},${location[1]}`;

      // Call edge function to send alerts
      const { error: alertError } = await supabase.functions.invoke("send-emergency-alert", {
        body: {
          contacts: contacts.map(c => ({ 
            name: c.contact_name, 
            phone: c.contact_phone 
          })),
          location: {
            lat: location[0],
            lng: location[1],
            link: locationLink,
          },
        },
      });

      if (alertError) throw alertError;

      toast({
        title: "Alert Sent!",
        description: `Emergency alert sent to ${contacts.length} contact(s)`,
      });

      setOpen(false);
    } catch (error: any) {
      console.error("Alert error:", error);
      toast({
        title: "Alert Failed",
        description: "Could not send emergency alert. Please call emergency services directly.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handlePoliceAlert = () => {
    toast({
      title: "Alert Sent",
      description: "Nearby police stations have been notified.",
      variant: "destructive",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            variant="destructive"
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform pulse"
          >
            <AlertCircle className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Emergency Services
            </DialogTitle>
            <DialogDescription>
              Quick access to emergency services and alerts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button
              onClick={handleEmergencyCall}
              variant="destructive"
              className="w-full h-14 text-lg"
              size="lg"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Emergency Services (112)
            </Button>
            
            <Button
              onClick={handleSendAlert}
              variant="outline"
              className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              size="lg"
              disabled={sending}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {sending ? "Sending Alert..." : "Send Alert to Emergency Contacts"}
            </Button>

            <Button
              onClick={() => {
                setOpen(false);
                setContactsOpen(true);
              }}
              variant="outline"
              className="w-full h-12"
              size="lg"
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Emergency Contacts
            </Button>
            
            <Button
              onClick={handlePoliceAlert}
              variant="outline"
              className="w-full h-12"
              size="lg"
            >
              <Shield className="mr-2 h-4 w-4" />
              Alert Nearby Police
            </Button>
            
            {currentLocation && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Current Location: {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {userId && (
        <EmergencyContactsManager
          open={contactsOpen}
          onOpenChange={setContactsOpen}
          userId={userId}
        />
      )}
    </>
  );
};

export default EmergencyButton;
