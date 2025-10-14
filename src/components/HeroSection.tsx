import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Shield } from "lucide-react";
import heroMap from "@/assets/hero-map.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroMap} 
          alt="Smart Route Navigation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6 animate-fade-in">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">AI-Powered Safety Navigation</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
          Navigate Safer,
          <br />
          Travel Smarter
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Smart Route uses real-time AI to find the safest path to your destination, 
          analyzing lighting, crowd density, hazards, and more.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-hero hover:opacity-90 transition-opacity text-lg px-8 py-6 shadow-lg"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Start Navigation
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-card/50 backdrop-blur-sm hover:bg-card/80"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Learn More
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            'Real-time Safety Analysis',
            'Hazard Detection',
            'Night Mode Optimization',
            'Emergency SOS'
          ].map((feature) => (
            <div
              key={feature}
              className="px-6 py-3 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 text-sm font-medium shadow-sm"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-primary/50" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
