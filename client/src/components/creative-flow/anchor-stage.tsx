import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnchorStageProps {
  onSubmit: (data: {
    recipientName: string;
    anchor: string;
    occasion?: string;
    tone?: string;
  }) => void;
  isLoading: boolean;
}

export default function AnchorStage({ onSubmit, isLoading }: AnchorStageProps) {
  const [recipientName, setRecipientName] = useState("");
  const [anchor, setAnchor] = useState("");
  const [occasion, setOccasion] = useState("");
  const [customOccasion, setCustomOccasion] = useState("");
  const [tone, setTone] = useState("");

  const handleSubmit = () => {
    if (!anchor.trim()) {
      alert('Please describe the feeling you want to convey');
      return;
    }

    onSubmit({
      recipientName: recipientName.trim() || "Someone special",
      anchor: anchor.trim(),
      occasion: occasion === "other" ? customOccasion.trim() : (occasion || undefined),
      tone: tone || undefined
    });
  };

  return (
    <div className="w-full max-w-2xl m-auto glass-morphism rounded-2xl shadow-2xl p-8 sm:p-12 fade-in">
      <div className="text-center">
        <div className="mb-6">
          <i className="fas fa-lightbulb text-4xl text-indigo-500 mb-4"></i>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">DEFINE YOUR HUG</h1>
        </div>
        <p className="text-slate-600 mt-4 text-lg max-w-lg mx-auto leading-relaxed">"Think of this like a recipe from the heart. We’ll gather a few ingredients, then cook up something honest and real. There’s no wrong way to say what matters. Let’s just start."</p>
        
        <div className="mt-10 text-left space-y-6">
          <div className="space-y-3">
            <Label htmlFor="recipient-name" className="text-xl font-semibold text-slate-700 flex items-center">
              <i className="fas fa-user text-indigo-500 mr-2"></i>
              Want to say who it's for? Totally optional.
            </Label>
            <p className="text-sm text-slate-600 mt-1 mb-2">
              You can write a name, like 'Dad' or 'My neighbor' — or leave it blank.
            </p>
            <Input
              id="recipient-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="mt-2 p-4 glass-secondary border-slate-300/70 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-slate-800 placeholder-slate-500"
              placeholder="Enter their name or leave blank..."
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="anchor" className="text-xl font-semibold text-slate-700 flex items-center">
              <i className="fas fa-heart text-pink-500 mr-2"></i>
              How do you want them to feel when they hear this?
            </Label>
            <Input
              id="anchor"
              value={anchor}
              onChange={(e) => setAnchor(e.target.value)}
              className="mt-2 p-4 glass-secondary border-slate-300/70 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-slate-800 placeholder-slate-500"
              placeholder="e.g., deeply appreciated, truly valued, completely loved, genuinely supported..."
            />
          </div>
          
          <details className="mt-6">
            <summary className="cursor-pointer text-lg font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              <i className="fas fa-cog mr-2"></i>Optional Context
            </summary>
            <div className="mt-4 space-y-4 pl-6">
              <div>
                <Label className="block text-sm font-medium text-slate-600 mb-2">Occasion</Label>
                <Select value={occasion} onValueChange={setOccasion}>
                  <SelectTrigger className="glass-secondary border-slate-300/70">
                    <SelectValue placeholder="Select occasion..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="thank-you">Thank you</SelectItem>
                    <SelectItem value="apology">Apology</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="just-because">Just because</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {occasion === "other" && (
                  <Input
                    value={customOccasion}
                    onChange={(e) => setCustomOccasion(e.target.value)}
                    className="mt-2 glass-secondary border-slate-300/70 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    placeholder="Please specify the occasion..."
                  />
                )}
              </div>
              <div>
                <Label className="block text-sm font-medium text-slate-600 mb-2">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="glass-secondary border-slate-300/70">
                    <SelectValue placeholder="Select tone..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heartfelt">Heartfelt</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </details>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !anchor.trim()}
          className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-12 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 hover:shadow-xl"
        >
          <i className="fas fa-search mr-2"></i>
          {isLoading ? 'Generating...' : 'Gather'}
        </Button>
      </div>
    </div>
  );
}
