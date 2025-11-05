import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, ArrowUp, Navigation2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Direction {
  instruction: string;
  distance: string;
  type: 'left' | 'right' | 'straight' | 'destination';
  completed?: boolean;
}

interface TurnByTurnDirectionsProps {
  directions: Direction[];
  currentStep: number;
}

const TurnByTurnDirections = ({ directions, currentStep }: TurnByTurnDirectionsProps) => {
  const getDirectionIcon = (type: string) => {
    switch (type) {
      case 'left':
        return <ArrowLeft className="h-5 w-5" />;
      case 'right':
        return <ArrowRight className="h-5 w-5" />;
      case 'straight':
        return <ArrowUp className="h-5 w-5" />;
      case 'destination':
        return <Navigation2 className="h-5 w-5" />;
      default:
        return <ArrowUp className="h-5 w-5" />;
    }
  };

  const currentDirection = directions[currentStep];

  return (
    <div className="space-y-3">
      {/* Current Direction - Large Display */}
      {currentDirection && (
        <Card className="p-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              {getDirectionIcon(currentDirection.type)}
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold mb-1">{currentDirection.instruction}</div>
              <div className="text-sm opacity-90">in {currentDirection.distance}</div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Step {currentStep + 1}/{directions.length}
            </Badge>
          </div>
        </Card>
      )}

      {/* Upcoming Directions */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3 text-muted-foreground">UPCOMING DIRECTIONS</h4>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {directions.map((direction, index) => {
            if (index <= currentStep) return null;
            
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="text-muted-foreground">
                  {getDirectionIcon(direction.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{direction.instruction}</div>
                  <div className="text-xs text-muted-foreground">{direction.distance}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {index + 1}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default TurnByTurnDirections;
