import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Square, Navigation } from "lucide-react";

interface NavigationControlsProps {
  isNavigating: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

const NavigationControls = ({
  isNavigating,
  isPaused,
  onStart,
  onPause,
  onStop,
}: NavigationControlsProps) => {
  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Navigation Controls</span>
        </div>
        <div className="flex gap-2">
          {!isNavigating ? (
            <Button onClick={onStart} size="sm" className="bg-gradient-hero">
              <Play className="h-4 w-4 mr-1" />
              Start Navigation
            </Button>
          ) : (
            <>
              <Button onClick={onPause} size="sm" variant="outline">
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                )}
              </Button>
              <Button onClick={onStop} size="sm" variant="destructive">
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NavigationControls;
