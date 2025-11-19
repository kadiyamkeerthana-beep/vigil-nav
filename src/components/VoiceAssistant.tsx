import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RealtimeVoiceChat } from "@/utils/RealtimeAudio";
import { Mic, MicOff, Volume2, VolumeX, Moon } from "lucide-react";

interface VoiceAssistantProps {
  isNightMode: boolean;
  currentLocation?: [number, number];
  isNavigating: boolean;
}

const VoiceAssistant = ({ isNightMode, currentLocation, isNavigating }: VoiceAssistantProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const chatRef = useRef<RealtimeVoiceChat | null>(null);
  const { toast } = useToast();

  const handleMessage = (event: any) => {
    console.log('Voice event:', event.type);
    
    if (event.type === 'response.audio_transcript.delta') {
      setTranscript(prev => prev + event.delta);
      setIsSpeaking(true);
    } else if (event.type === 'response.audio_transcript.done') {
      setIsSpeaking(false);
      setTimeout(() => setTranscript(""), 3000);
    } else if (event.type === 'input_audio_buffer.speech_started') {
      setIsListening(true);
    } else if (event.type === 'input_audio_buffer.speech_stopped') {
      setIsListening(false);
    }
  };

  const startVoiceAssistant = async () => {
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      chatRef.current = new RealtimeVoiceChat(handleMessage);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Voice Assistant Active",
        description: "You can now speak to get navigation help",
      });
    } catch (error) {
      console.error('Error starting voice assistant:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to start voice assistant',
        variant: "destructive",
      });
    }
  };

  const stopVoiceAssistant = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    setTranscript("");
    
    toast({
      title: "Voice Assistant Stopped",
      description: "Voice assistance has been disabled",
    });
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  // Show the assistant prominently during night mode
  if (!isNightMode && !isConnected) {
    return null;
  }

  return (
    <Card className={`fixed top-20 right-6 z-40 p-4 w-64 ${
      isNightMode ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30' : ''
    }`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isNightMode && <Moon className="h-4 w-4 text-primary" />}
            <h3 className="font-semibold text-sm">Voice Assistant</h3>
          </div>
          {isConnected && (
            <div className="flex items-center gap-1">
              {isListening && (
                <div className="flex gap-0.5">
                  <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              {isSpeaking && <Volume2 className="h-4 w-4 text-primary animate-pulse" />}
            </div>
          )}
        </div>

        {isNightMode && !isConnected && (
          <p className="text-xs text-muted-foreground">
            Enhanced safety assistance for night-time navigation
          </p>
        )}

        {transcript && (
          <div className="text-xs bg-secondary/50 p-2 rounded">
            {transcript}
          </div>
        )}

        {!isConnected ? (
          <Button 
            onClick={startVoiceAssistant}
            className="w-full gap-2"
            size="sm"
          >
            <Mic className="h-4 w-4" />
            Start Voice Assistant
          </Button>
        ) : (
          <Button 
            onClick={stopVoiceAssistant}
            variant="destructive"
            className="w-full gap-2"
            size="sm"
          >
            <MicOff className="h-4 w-4" />
            Stop Assistant
          </Button>
        )}

        {isConnected && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Connected
            </p>
            <p>Say "Help" for navigation assistance</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceAssistant;
