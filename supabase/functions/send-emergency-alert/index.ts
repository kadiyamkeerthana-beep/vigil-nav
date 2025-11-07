import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmergencyContact {
  name: string;
  phone: string;
}

interface AlertRequest {
  contacts: EmergencyContact[];
  location: {
    lat: number;
    lng: number;
    link: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contacts, location }: AlertRequest = await req.json();

    console.log('Emergency alert request:', { 
      contactCount: contacts.length, 
      location 
    });

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No contacts provided' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // In a production environment, you would integrate with an SMS service like:
    // - Twilio
    // - MSG91
    // - AWS SNS
    // - Firebase Cloud Messaging
    
    // For now, we'll simulate sending alerts
    const alertMessage = `🚨 EMERGENCY ALERT: Your contact needs help! Location: ${location.link}`;
    
    const results = contacts.map(contact => {
      console.log(`Sending alert to ${contact.name} (${contact.phone}): ${alertMessage}`);
      
      // TODO: Replace with actual SMS service integration
      // Example for Twilio:
      // await twilioClient.messages.create({
      //   body: alertMessage,
      //   to: contact.phone,
      //   from: YOUR_TWILIO_NUMBER
      // });
      
      return {
        name: contact.name,
        phone: contact.phone,
        status: 'simulated', // Change to 'sent' in production
      };
    });

    console.log('Emergency alerts processed:', results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Alert sent to ${contacts.length} contact(s)`,
        results 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-emergency-alert function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
