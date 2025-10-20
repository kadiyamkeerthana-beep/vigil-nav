import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authHelpers, profileHelpers, routeHelpers, Profile, SavedRoute, TripHistory } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { User, ArrowLeft, MapPin, Clock, Shield, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional().or(z.literal(''))
});

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [tripHistory, setTripHistory] = useState<TripHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
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
      
      const { data: profileData } = await profileHelpers.getProfile(session.user.id);
      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        setPhone(profileData.phone || "");
      }

      const { data: routes } = await routeHelpers.getSavedRoutes(session.user.id);
      if (routes) setSavedRoutes(routes);

      const { data: history } = await routeHelpers.getTripHistory(session.user.id);
      if (history) setTripHistory(history);
    };

    initUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    // Validate inputs
    const validation = profileUpdateSchema.safeParse({
      full_name: fullName,
      phone: phone
    });

    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors.map(e => e.message).join(", "),
        variant: "destructive",
      });
      return;
    }

    const { error } = await profileHelpers.updateProfile(user.id, {
      full_name: validation.data.full_name,
      phone: validation.data.phone,
    } as Partial<Profile>);

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      
      const { data: updatedProfile } = await profileHelpers.getProfile(user.id);
      if (updatedProfile) setProfile(updatedProfile);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    const { error } = await routeHelpers.deleteSavedRoute(routeId);
    
    if (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Route Deleted",
        description: "Saved route has been removed.",
      });
      setSavedRoutes(savedRoutes.filter(r => r.id !== routeId));
    }
  };

  const handleSignOut = async () => {
    await authHelpers.signOut();
    navigate("/auth");
  };

  if (!user || !profile) {
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
            <Button
              variant="ghost"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Routes
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              My Profile
            </h1>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle>{profile.full_name || "User"}</CardTitle>
                    <CardDescription>{profile.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p>{profile.phone || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Member Since</Label>
                      <p>{new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button onClick={() => setIsEditing(true)} className="w-full">
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile} className="flex-1">
                        Save
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Safety Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Trips</span>
                  <span className="font-semibold">{tripHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saved Routes</span>
                  <span className="font-semibold">{savedRoutes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Safety Score</span>
                  <span className="font-semibold text-green-600">
                    {tripHistory.length > 0
                      ? Math.round(tripHistory.reduce((acc, t) => acc + t.safety_score, 0) / tripHistory.length)
                      : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Routes and History */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="saved">Saved Routes</TabsTrigger>
                <TabsTrigger value="history">Trip History</TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="space-y-4">
                {savedRoutes.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No saved routes yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  savedRoutes.map((route) => (
                    <Card key={route.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{route.route_name}</CardTitle>
                            <CardDescription>
                              {route.from_location} → {route.to_location}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRoute(route.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span>Safety: {route.safety_score}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{route.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span>{route.distance}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {tripHistory.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No trip history yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  tripHistory.map((trip) => (
                    <Card key={trip.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {trip.from_location} → {trip.to_location}
                            </CardTitle>
                            <CardDescription>
                              {new Date(trip.completed_at).toLocaleString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span>Safety: {trip.safety_score}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{trip.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span>{trip.distance}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
