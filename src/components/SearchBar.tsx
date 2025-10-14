import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (from: string, to: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSearch = () => {
    if (from && to) {
      onSearch(from, to);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-xl shadow-lg p-6 space-y-4">
        {/* From Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
          <Input
            placeholder="Starting location"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="pl-10 pr-10 h-12 text-base"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {from && (
            <button
              onClick={() => setFrom("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* To Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <Input
            placeholder="Destination"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="pl-10 pr-10 h-12 text-base"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {to && (
            <button
              onClick={() => setTo("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!from || !to}
          className="w-full h-12 text-base bg-gradient-hero hover:opacity-90"
          size="lg"
        >
          <Navigation className="w-5 h-5 mr-2" />
          Find Safe Route
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
