import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin, TrendingUp } from "lucide-react";

interface NavigationDashboardProps {
  distanceTraveled: string;
  distanceRemaining: string;
  eta: string;
  progress: number;
}

const NavigationDashboard = ({
  distanceTraveled,
  distanceRemaining,
  eta,
  progress,
}: NavigationDashboardProps) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        Journey Progress
      </h3>
      
      <div className="space-y-3">
        <Progress value={progress} className="h-2" />
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Traveled</div>
            <div className="font-bold text-sm text-primary">{distanceTraveled}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Remaining</div>
            <div className="font-bold text-sm">{distanceRemaining}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              ETA
            </div>
            <div className="font-bold text-sm text-primary">{eta}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NavigationDashboard;
