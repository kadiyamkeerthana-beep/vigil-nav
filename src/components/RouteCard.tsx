import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RouteOption } from "@/data/mockData";
import { Clock, MapPin, Shield, Navigation, AlertTriangle } from "lucide-react";

interface RouteCardProps {
  route: RouteOption;
  isSelected: boolean;
  onSelect: () => void;
}

const RouteCard = ({ route, isSelected, onSelect }: RouteCardProps) => {
  const getSafetyColor = (score: number) => {
    if (score >= 85) return 'bg-gradient-safe';
    if (score >= 70) return 'bg-gradient-caution';
    return 'bg-gradient-danger';
  };

  const getSafetyBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 85) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'safe': return 'text-success';
      case 'balanced': return 'text-warning';
      case 'fast': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
        isSelected 
          ? 'border-primary border-2 shadow-lg bg-primary/5' 
          : 'border-border hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${getTypeColor(route.type)}`}>
              {route.name}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{route.distance}</span>
              </div>
            </div>
          </div>

          {/* Safety Score */}
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full ${getSafetyColor(route.safetyScore)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
              {route.safetyScore}
            </div>
            <span className="text-xs text-muted-foreground mt-1">Safety</span>
          </div>
        </div>

        {/* Features */}
        {route.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {route.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        )}

        {/* Hazards Warning */}
        {route.hazards.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-warning/10 border border-warning/20">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
            <span className="text-xs text-warning-foreground">
              {route.hazards.length} hazard{route.hazards.length !== 1 ? 's' : ''} on this route
            </span>
          </div>
        )}

        {/* Select Button */}
        <Button
          className={`w-full ${isSelected ? 'bg-primary' : ''}`}
          variant={isSelected ? 'default' : 'outline'}
        >
          <Navigation className="w-4 h-4 mr-2" />
          {isSelected ? 'Selected' : 'Select Route'}
        </Button>
      </div>
    </Card>
  );
};

export default RouteCard;
