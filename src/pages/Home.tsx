import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import MapView from "@/components/MapView";
import RouteCard from "@/components/RouteCard";
import SafetyFilters from "@/components/SafetyFilters";
import EmergencyButton from "@/components/EmergencyButton";
import { mockRoutes, mockHazards, safetyFilters, CENTER_COORDS, mockLightingZones, mockCrowdZones, mockEmergencyServices } from "@/data/mockData";
import { RouteOption, SafetyFilter } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Layers, User, Phone, MapPin, Moon } from "lucide-react";
import { authHelpers, routeHelpers } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [filters, setFilters] = useState<SafetyFilter[]>(safetyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showEmergencyServices, setShowEmergencyServices] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initUser = async () => {
      const { session } = await authHelpers.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    initUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSearch = (from: string, to: string) => {
    setFromLocation(from);
    setToLocation(to);
    
    toast({
      title: "Calculating Safe Routes",
      description: `Finding the safest path from ${from} to ${to}...`,
    });

    setTimeout(() => {
      // Determine which route set to show based on locations
      const searchKey = `${from.toLowerCase()}-${to.toLowerCase()}`;
      let filteredRoutes: RouteOption[] = [];
      
      if (searchKey.includes('vignan') && searchKey.includes('gajuwaka')) {
        filteredRoutes = mockRoutes.filter(r => r.id.includes('vignan-gajuwaka'));
      } else if (searchKey.includes('simhachalam') && searchKey.includes('vignan')) {
        filteredRoutes = mockRoutes.filter(r => r.id.includes('simhachalam-vignan'));
      } else if (searchKey.includes('gajuwaka') && (searchKey.includes('beach') || searchKey.includes('rk'))) {
        filteredRoutes = mockRoutes.filter(r => r.id.includes('gajuwaka-beach'));
      } else {
        // Default to first route set
        filteredRoutes = mockRoutes.slice(0, 3);
      }
      
      setRoutes(filteredRoutes);
      setSelectedRoute(filteredRoutes[0]);
      toast({
        title: "Routes Found",
        description: `${filteredRoutes.length} route options available`,
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

  const handleSaveRoute = async () => {
    if (!selectedRoute || !user) return;

    const { error } = await routeHelpers.saveRoute({
      user_id: user.id,
      route_name: selectedRoute.name,
      from_location: fromLocation || "Start Location",
      to_location: toLocation || "End Location",
      route_type: selectedRoute.type,
      safety_score: selectedRoute.safetyScore,
      duration: selectedRoute.duration,
      distance: selectedRoute.distance,
    });

    if (error) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Route Saved",
        description: "You can view this route in your profile.",
      });
    }
  };

  const handleCompleteTrip = async () => {
    if (!selectedRoute || !user) return;

    const { error } = await routeHelpers.addTripHistory({
      user_id: user.id,
      from_location: fromLocation || "Start Location",
      to_location: toLocation || "End Location",
      route_type: selectedRoute.type,
      safety_score: selectedRoute.safetyScore,
      duration: selectedRoute.duration,
      distance: selectedRoute.distance,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Trip Completed",
        description: "Added to your trip history.",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
            <div className="flex items-center gap-2">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {routes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Where do you want to go?</h2>
              <p className="text-muted-foreground">
                Enter your destination and we'll find the safest route for you
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={handleSearch} />
              
              {/* Quick Route Suggestions */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Try these popular routes:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleSearch('Vignan College, Vadlapudi', 'Gajuwaka, Visakhapatnam')}
                    className="text-sm px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                  >
                    Vignan → Gajuwaka
                  </button>
                  <button
                    onClick={() => handleSearch('Simhachalam Temple', 'Vignan College, Vadlapudi')}
                    className="text-sm px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                  >
                    Simhachalam → Vignan
                  </button>
                  <button
                    onClick={() => handleSearch('Gajuwaka', 'RK Beach, Visakhapatnam')}
                    className="text-sm px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                  >
                    Gajuwaka → RK Beach
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
              <SearchBar onSearch={handleSearch} />
              
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

              {selectedRoute && (
                <div className="flex gap-2">
                  <Button onClick={handleSaveRoute} variant="outline" className="flex-1">
                    Save Route
                  </Button>
                  <Button onClick={handleCompleteTrip} className="flex-1 bg-gradient-hero">
                    Complete Trip
                  </Button>
                </div>
              )}

              {showFilters && (
                <SafetyFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
              {/* Emergency Services & Night Mode Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-destructive" />
                      <div>
                        <Label htmlFor="emergency-toggle" className="text-sm font-semibold cursor-pointer">
                          Emergency Services
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Hospitals, Police, Fire
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emergency-toggle"
                      checked={showEmergencyServices}
                      onCheckedChange={setShowEmergencyServices}
                    />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="h-5 w-5 text-primary" />
                      <div>
                        <Label htmlFor="night-mode-toggle" className="text-sm font-semibold cursor-pointer">
                          Night Mode
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Lighting & Crowd Zones
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="night-mode-toggle"
                      checked={nightMode}
                      onCheckedChange={setNightMode}
                    />
                  </div>
                </Card>
              </div>

              {/* Route Summary */}
              {selectedRoute && (
                <Card className="p-5 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{selectedRoute.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{fromLocation} → {toLocation}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{selectedRoute.safetyScore}%</div>
                      <div className="text-xs text-muted-foreground">Safety Score</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                      <div className="text-sm font-semibold">{selectedRoute.distance}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="text-sm font-semibold">{selectedRoute.duration}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Lighting</div>
                      <div className="text-sm font-semibold">{selectedRoute.lightingScore}%</div>
                    </div>
                  </div>

                  <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${selectedRoute.safetyScore}%` }}
                    />
                  </div>
                </Card>
              )}

              {/* Map View */}
              <div className="sticky top-24 h-[calc(100vh-350px)] min-h-[400px]">
                <MapView
                  routes={routes}
                  hazards={mockHazards}
                  selectedRoute={selectedRoute}
                  center={CENTER_COORDS}
                  lightingZones={nightMode ? mockLightingZones : []}
                  crowdZones={nightMode ? mockCrowdZones : []}
                  emergencyServices={mockEmergencyServices}
                  showEmergencyServices={showEmergencyServices}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <EmergencyButton />
    </div>
  );
};

export default Home;
