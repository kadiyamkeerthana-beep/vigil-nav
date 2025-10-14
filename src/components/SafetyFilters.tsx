import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SafetyFilter } from "@/data/mockData";
import { Sun, Shield, Camera, Users, AlertTriangle, Cloud } from "lucide-react";
import { useState } from "react";

interface SafetyFiltersProps {
  filters: SafetyFilter[];
  onFilterChange: (filterId: string, enabled: boolean) => void;
}

const iconMap: Record<string, any> = {
  Sun,
  Shield,
  Camera,
  Users,
  AlertTriangle,
  Cloud,
};

const SafetyFilters = ({ filters, onFilterChange }: SafetyFiltersProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            Safety Filters
          </h3>
          <p className="text-sm text-muted-foreground">
            Customize your route based on safety preferences
          </p>
        </div>

        <div className="space-y-4">
          {filters.map((filter) => {
            const Icon = iconMap[filter.icon] || Shield;
            return (
              <div
                key={filter.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${filter.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`w-5 h-5 ${filter.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={filter.id} className="cursor-pointer font-medium">
                      {filter.name}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {filter.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={filter.id}
                  checked={filter.enabled}
                  onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default SafetyFilters;
