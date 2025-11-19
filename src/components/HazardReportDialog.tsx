import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { hazardHelpers } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const hazardSchema = z.object({
  hazardType: z.string().min(1, "Please select a hazard type"),
  severity: z.string().min(1, "Please select severity level"),
  description: z.string().trim().min(5, "Description must be at least 5 characters").max(500, "Description too long"),
});

interface HazardReportDialogProps {
  userId: string;
  currentLocation: [number, number] | null;
  onHazardReported: () => void;
}

const HazardReportDialog = ({ userId, currentLocation, onHazardReported }: HazardReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [hazardType, setHazardType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Cannot report hazard without current location",
        variant: "destructive",
      });
      return;
    }

    try {
      const validation = hazardSchema.safeParse({
        hazardType,
        severity,
        description,
      });

      if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(", ");
        toast({
          title: "Validation Error",
          description: errors,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      const { error } = await hazardHelpers.reportHazard({
        user_id: userId,
        hazard_type: hazardType,
        severity,
        description,
        location_lat: currentLocation[0],
        location_lng: currentLocation[1],
      });

      if (error) {
        toast({
          title: "Report Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Hazard Reported",
        description: "Thank you for helping keep the community safe!",
      });

      setOpen(false);
      setHazardType("");
      setSeverity("");
      setDescription("");
      onHazardReported();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to report hazard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          Report Hazard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Road Hazard</DialogTitle>
          <DialogDescription>
            Help the community by reporting unsafe spots or hazards on the road.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="hazard-type">Hazard Type</Label>
            <Select value={hazardType} onValueChange={setHazardType}>
              <SelectTrigger id="hazard-type">
                <SelectValue placeholder="Select hazard type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="flooding">Flooding</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="debris">Road Debris</SelectItem>
                <SelectItem value="poor-lighting">Poor Lighting</SelectItem>
                <SelectItem value="unsafe-area">Unsafe Area</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger id="severity">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                <SelectItem value="medium">Medium - Moderate risk</SelectItem>
                <SelectItem value="high">High - Dangerous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the hazard in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 characters
            </p>
          </div>

          {currentLocation && (
            <div className="text-xs text-muted-foreground">
              Location: {currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !currentLocation}>
            {isSubmitting ? "Reporting..." : "Report Hazard"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HazardReportDialog;
