import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Edit3, Sparkles } from "lucide-react";

interface Ingredient {
  id: number;
  prompt: string;
  content: string;
  timestamp: string;
}

export default function CraftSoulHug() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [wordCount, setWordCount] = useState(0);

  // Load session data from localStorage or session storage
  useEffect(() => {
    try {
      const sessionData = localStorage.getItem('creativeFlowSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.finalMessage) {
          setMessage(session.finalMessage);
        }
        if (session.ingredients) {
          setIngredients(session.ingredients);
        }
      }
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  }, []);

  // Update word count when message changes
  useEffect(() => {
    const words = message.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [message]);

  // Save message to session storage
  const saveMessage = () => {
    try {
      const sessionData = localStorage.getItem('creativeFlowSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.finalMessage = message;
        localStorage.setItem('creativeFlowSession', JSON.stringify(session));
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleNext = () => {
    saveMessage();
    setLocation("/audio-hug");
  };

  const handleBack = () => {
    saveMessage();
    setLocation("/creative-flow");
  };

  const copyMessage = () => {
    if (message.trim()) {
      navigator.clipboard.writeText(message);
      alert('Message copied to clipboard!');
    }
  };

  const clearMessage = () => {
    if (confirm('Are you sure you want to clear the message?')) {
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Craft Your Soul Hug
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Refine your message with heart. Use your collected ingredients to create something truly meaningful.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Ingredients Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                  Your Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ingredients.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {ingredients.map((ingredient) => (
                      <div
                        key={ingredient.id}
                        className="p-3 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors"
                        onClick={() => {
                          const newText = message + (message ? '\n\n' : '') + ingredient.content;
                          setMessage(newText);
                        }}
                      >
                        <p className="text-xs text-purple-600 font-medium mb-1">
                          {ingredient.prompt}
                        </p>
                        <p className="text-sm text-gray-700">
                          {ingredient.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No ingredients available.</p>
                    <p className="text-xs mt-1">Go back to Creative Flow to gather some!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Edit3 className="w-5 h-5" />
                    Your Soul Hug Message
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {wordCount} words
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyMessage}
                        disabled={!message.trim()}
                        size="sm"
                        variant="outline"
                        className="text-purple-600 border-purple-300 hover:bg-purple-50"
                      >
                        Copy
                      </Button>
                      <Button
                        onClick={clearMessage}
                        disabled={!message.trim()}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Begin crafting your Soul Hug here... Click on ingredients from the left panel to add them, or start typing your heart's message."
                  className="min-h-[400px] resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg p-4 text-gray-800 leading-relaxed text-base"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                />
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    💡 Tip: Click on ingredients from the left panel to add them to your message
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Creative Flow
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!message.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            Continue to Audio Hug
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}