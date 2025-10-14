import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import MapView from "@/components/MapView";
import RouteCard from "@/components/RouteCard";
import SafetyFilters from "@/components/SafetyFilters";
import EmergencyButton from "@/components/EmergencyButton";
import { mockRoutes, mockHazards, safetyFilters, CENTER_COORDS } from "@/data/mockData";
import { RouteOption, SafetyFilter } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Layers } from "lucide-react";

const Index = () => {
  const [showHero, setShowHero] = useState(true);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [filters, setFilters] = useState<SafetyFilter[]>(safetyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setShowHero(false);
  };

  const handleSearch = (from: string, to: string) => {
    toast({
      title: "Calculating Safe Routes",
      description: `Finding the safest path from ${from} to ${to}...`,
    });

    // Simulate route calculation
    setTimeout(() => {
      setRoutes(mockRoutes);
      setSelectedRoute(mockRoutes[0]);
      toast({
        title: "Routes Found",
        description: `${mockRoutes.length} route options available`,
      });
    }, 1000);
  };

  const handleFilterChange = (filterId: string, enabled: boolean) => {
    setFilters(prev =>
      prev.map(f => f.id === filterId ? { ...f, enabled } : f)
    );
    
    toast({
      title: enabled ? "Filter Enabled" : "Filter Disabled",
      description: `${filters.find(f => f.id === filterId)?.name} ${enabled ? 'activated' : 'deactivated'}`,
    });
  };

  const handleBack = () => {
    setRoutes([]);
    setSelectedRoute(null);
  };

  if (showHero) {
    return <HeroSection onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {routes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Smart Route
              </h1>
            </div>
            {routes.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Layers className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {routes.length === 0 ? (
          /* Initial Search View */
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Where do you want to go?</h2>
              <p className="text-muted-foreground">
                Enter your destination and we'll find the safest route for you
              </p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        ) : (
          /* Map and Routes View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Route Options & Filters */}
            <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
              <SearchBar onSearch={handleSearch} />
              
              {/* Route Options */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  ROUTE OPTIONS ({routes.length})
                </h3>
                {routes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    isSelected={selectedRoute?.id === route.id}
                    onSelect={() => setSelectedRoute(route)}
                  />
                ))}
              </div>

              {/* Safety Filters */}
              {showFilters && (
                <SafetyFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>

            {/* Right Panel - Map */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="sticky top-24 h-[calc(100vh-120px)] min-h-[500px]">
                <MapView
                  routes={routes}
                  hazards={mockHazards}
                  selectedRoute={selectedRoute}
                  center={CENTER_COORDS}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Emergency Button */}
      <EmergencyButton />
    </div>
  );
};

export default Index;
