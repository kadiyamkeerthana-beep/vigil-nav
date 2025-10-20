import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedRoute {
  id: string;
  user_id: string;
  route_name: string;
  from_location: string;
  to_location: string;
  route_type: string;
  safety_score: number;
  duration: string;
  distance: string;
  created_at: string;
}

export interface TripHistory {
  id: string;
  user_id: string;
  from_location: string;
  to_location: string;
  route_type: string;
  safety_score: number;
  duration: string;
  distance: string;
  completed_at: string;
}

export interface HazardReport {
  id: string;
  user_id: string;
  hazard_type: string;
  location_lat: number;
  location_lng: number;
  description: string;
  severity: string;
  created_at: string;
}

// Public view of hazards without user_id for privacy
export interface PublicHazard {
  id: string;
  hazard_type: string;
  location_lat: number;
  location_lng: number;
  description: string;
  severity: string;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  contact_name: string;
  contact_phone: string;
  relationship: string | null;
  created_at: string;
}

export const authHelpers = {
  async signUp(email: string, password: string, fullName: string, phone: string) {
    const redirectUrl = `${window.location.origin}/home`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });
    
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },
};

export const profileHelpers = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data: data as Profile | null, error };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data: data as Profile | null, error };
  },
};

export const routeHelpers = {
  async saveRoute(route: Omit<SavedRoute, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('saved_routes')
      .insert(route)
      .select()
      .single();
    
    return { data: data as SavedRoute | null, error };
  },

  async getSavedRoutes(userId: string) {
    const { data, error } = await supabase
      .from('saved_routes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data: data as SavedRoute[] | null, error };
  },

  async deleteSavedRoute(routeId: string) {
    const { error } = await supabase
      .from('saved_routes')
      .delete()
      .eq('id', routeId);
    
    return { error };
  },

  async addTripHistory(trip: Omit<TripHistory, 'id' | 'completed_at'>) {
    const { data, error } = await supabase
      .from('trip_history')
      .insert(trip)
      .select()
      .single();
    
    return { data: data as TripHistory | null, error };
  },

  async getTripHistory(userId: string) {
    const { data, error } = await supabase
      .from('trip_history')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(10);
    
    return { data: data as TripHistory[] | null, error };
  },
};

export const hazardHelpers = {
  async reportHazard(report: Omit<HazardReport, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('hazard_reports')
      .insert(report)
      .select()
      .single();
    
    return { data: data as HazardReport | null, error };
  },

  // Get public hazards (without user_id) for map display
  async getPublicHazards() {
    const { data, error } = await supabase
      .from('public_hazards')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data: data as PublicHazard[] | null, error };
  },

  // Get user's own hazard reports
  async getMyHazardReports(userId: string) {
    const { data, error } = await supabase
      .from('hazard_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data: data as HazardReport[] | null, error };
  },
};

export const emergencyHelpers = {
  async getEmergencyContacts(userId: string) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId);
    
    return { data: data as EmergencyContact[] | null, error };
  },

  async addEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert(contact)
      .select()
      .single();
    
    return { data: data as EmergencyContact | null, error };
  },

  async deleteEmergencyContact(contactId: string) {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId);
    
    return { error };
  },
};
