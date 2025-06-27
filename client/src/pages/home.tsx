import { useState, useEffect } from "react";
import { Link } from "wouter";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { getUserCredits, addUserCredits } from "@/services/creditService";
import AuthModal from "@/components/auth/AuthModal";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [credits, setCredits] = useState(0);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  // Fetch user credits when user changes
  useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const c = await getUserCredits();
        setCredits(c);
      } else {
        setCredits(0);
      }
    }
    fetchCredits();
  }, [user]);

  const handleEarnCredits = async () => {
    await addUserCredits(2);
    const newCredits = await getUserCredits();
    setCredits(newCredits);
    alert("You earned 2 credits!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 bg-gradient-to-br from-purple-600 to-blue-800">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">SoulLift Audio</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Emotional Intelligence meets AI — Craft your perfect Soul Hug
        </p>
      </div>

      <div className="space-y-4 w-full max-w-sm">
        <Link 
          href="/creative-flow"
          className="block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 text-center hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40"
        >
          <div className="font-semibold text-lg mb-2">Create New Hug</div>
          <div className="text-sm text-white/80">Start your creative journey</div>
        </Link>

        <Link 
          href="/my-hugs"
          className="block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 text-center hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40"
        >
          <div className="font-semibold text-lg mb-2">View My Hugs</div>
          <div className="text-sm text-white/80">See your saved creations</div>
        </Link>

        <Link 
          href="/audio-hug"
          className="block bg-green-500/20 backdrop-blur-sm rounded-lg px-6 py-4 text-center hover:bg-green-500/30 transition-all duration-200 border border-green-300/40 hover:border-green-300/60"
        >
          <div className="font-semibold text-lg mb-2">Audio Hug</div>
          <div className="text-sm text-white/80">Explore audio features</div>
        </Link>

        {user ? (
          <div className="space-y-3">
            <div className="text-center text-white/70 text-sm">
              Welcome back, {user.displayName || user.email?.split('@')[0]}!
            </div>
            
            {/* Credits Display */}
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <div className="flex items-center justify-center gap-2">
                <span className="text-white/80 text-sm">Your credits:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-white">{credits}</span>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
              <button
                onClick={handleEarnCredits}
                className="mt-2 text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
              >
                Earn 2 Credits (Demo)
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-4 transition-all duration-200 font-semibold"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="block w-full text-center underline text-white/70 hover:text-white transition-colors py-3"
          >
            Log In or Sign Up
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end w-full max-w-sm mt-8">
        <Link 
          href="/creative-flow"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          Next <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
      />
    </div>
  );
}