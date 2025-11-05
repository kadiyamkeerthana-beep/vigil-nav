import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gauge } from "lucide-react";

export type SpeedMode = 'slow' | 'normal' | 'fast';

interface SpeedControlProps {
  currentSpeed: SpeedMode;
  onSpeedChange: (speed: SpeedMode) => void;
  disabled?: boolean;
}

const SpeedControl = ({ currentSpeed, onSpeedChange, disabled = false }: SpeedControlProps) => {
  const speeds: { mode: SpeedMode; label: string; icon: string }[] = [
    { mode: 'slow', label: 'Slow', icon: '🐢' },
    { mode: 'normal', label: 'Normal', icon: '🚗' },
    { mode: 'fast', label: 'Fast', icon: '🚀' },
  ];

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-background border-primary/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Animation Speed</span>
        </div>
        <div className="flex gap-2">
          {speeds.map((speed) => (
            <Button
              key={speed.mode}
              onClick={() => onSpeedChange(speed.mode)}
              variant={currentSpeed === speed.mode ? 'default' : 'outline'}
              size="sm"
              disabled={disabled}
              className={
                currentSpeed === speed.mode
                  ? 'bg-gradient-hero'
                  : ''
              }
            >
              <span className="mr-1">{speed.icon}</span>
              {speed.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SpeedControl;
