import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Phone, MapPin, Share2, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EmergencyButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleEmergencyCall = () => {
    toast({
      title: "Emergency Services Alerted",
      description: "Your location has been shared and emergency services are being contacted.",
      variant: "destructive",
    });
    setIsOpen(false);
  };

  const handleShareLocation = () => {
    toast({
      title: "Location Shared",
      description: "Your live location has been shared with emergency contacts.",
    });
  };

  const handlePoliceAlert = () => {
    toast({
      title: "Police Notified",
      description: "Nearby police stations have been alerted of your location.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-danger hover:opacity-90 shadow-xl fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full p-0 animate-pulse"
          title="Emergency SOS"
        >
          <AlertCircle className="w-8 h-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-6 h-6" />
            Emergency Assistance
          </DialogTitle>
          <DialogDescription>
            Choose an emergency action. Your current location will be shared automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <Button
            onClick={handleEmergencyCall}
            className="w-full bg-gradient-danger hover:opacity-90 text-lg py-6"
            size="lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Emergency Services
          </Button>
          
          <Button
            onClick={handleShareLocation}
            variant="outline"
            className="w-full py-6"
            size="lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Live Location
          </Button>

          <Button
            onClick={handlePoliceAlert}
            variant="outline"
            className="w-full py-6"
            size="lg"
          >
            <Shield className="w-5 h-5 mr-2" />
            Alert Nearby Police
          </Button>

          <div className="p-4 bg-muted rounded-lg mt-4">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Current Location</p>
                <p className="text-xs text-muted-foreground mt-1">
                  40.7128° N, 74.0060° W
                </p>
                <p className="text-xs text-muted-foreground">
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyButton;
