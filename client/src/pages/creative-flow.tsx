import { useState, useEffect } from "react";
import { useCreativeFlow } from "@/hooks/use-creative-flow";
import StageNavigation from "@/components/creative-flow/stage-navigation";
import AnchorStage from "@/components/creative-flow/anchor-stage";
import PaletteStage from "@/components/creative-flow/palette-stage";
import LoomStage from "@/components/creative-flow/loom-stage";
import IngredientModal from "@/components/creative-flow/ingredient-modal";
import AudioHug from "@/pages/audio-hug";
import { DirectionArrow } from "@/components/ui/direction-arrow";
import { GuidedTour } from "@/components/ui/guided-tour";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CreativeFlow() {
  const {
    state,
    currentStage,
    setCurrentStage,
    updateSession,
    addIngredient,
    removeIngredient,
    generatePrompts,
    aiWeave,
    aiStitch,
    isLoading
  } = useCreativeFlow();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [showTour, setShowTour] = useState(false);

  // Firebase Auth state monitoring
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User is signed in:", {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        console.log("❌ User is signed out");
      }
    });

    return () => unsubscribe();
  }, []);

  const openModal = (promptText: string) => {
    setCurrentPrompt(promptText);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentPrompt("");
  };

  const handleAddIngredient = async (content: string) => {
    if (!content.trim()) return;
    
    await addIngredient({
      prompt: currentPrompt,
      content: content.trim()
    });
    closeModal();
  };

  const handleAddDraggedIngredient = async (ingredient: { prompt: string; content: string }) => {
    await addIngredient(ingredient);
  };

  const handleAnchorSubmit = async (data: {
    recipientName: string;
    anchor: string;
    occasion?: string;
    tone?: string;
  }) => {
    try {
      await updateSession(data);
      await generatePrompts(data.recipientName, data.anchor, data.occasion, data.tone);
      setCurrentStage('reflection');
    } catch (error) {
      console.error('Error setting anchor:', error);
    }
  };

  const handleAIWeave = async (messageLength?: string) => {
    if (!state.session) {
      console.error('No session available for AI Weave');
      return;
    }
    
    if (!state.session.ingredients || state.session.ingredients.length === 0) {
      alert('Please add some ingredients before weaving a message.');
      return;
    }

    try {
      console.log('Starting AI Weave with:', {
        recipientName: state.session.recipientName,
        anchor: state.session.anchor,
        ingredients: state.session.ingredients
      });

      const message = await aiWeave({
        recipientName: state.session.recipientName,
        anchor: state.session.anchor,
        ingredients: (state.session.ingredients || []).map(ing => ({
          prompt: ing.prompt,
          content: ing.content
        })),
        occasion: state.session.occasion ?? undefined,
        tone: state.session.tone ?? undefined,
        messageLength: messageLength
      });
      
      console.log('AI Weave result:', message);
      
      if (message) {
        await updateSession({ finalMessage: message });
      }
    } catch (error) {
      console.error('AI Weave failed:', error);
      alert('Failed to weave message. Please try again.');
    }
  };

  const handleAIStitch = async (currentMessage: string) => {
    if (!state.session) {
      console.error('No session available for AI Stitch');
      return;
    }
    
    if (!currentMessage.trim()) {
      alert('Please write a message before trying to polish it.');
      return;
    }

    try {
      console.log('Starting AI Stitch with:', {
        currentMessage,
        recipientName: state.session.recipientName,
        anchor: state.session.anchor
      });

      const improvedMessage = await aiStitch({
        currentMessage,
        recipientName: state.session.recipientName,
        anchor: state.session.anchor
      });
      
      console.log('AI Stitch result:', improvedMessage);
      
      if (improvedMessage) {
        await updateSession({ finalMessage: improvedMessage });
      }
    } catch (error) {
      console.error('AI Stitch failed:', error);
      alert('Failed to polish message. Please try again.');
    }
  };

  const startOver = () => {
    if (confirm('Are you sure you want to start over? This will clear all your progress.')) {
      window.location.reload();
    }
  };

  const tourSteps = [
    {
      targetId: "stage-navigation",
      title: "Navigation",
      content: "Track your progress through the four stages of creating a Soul Hug.",
      direction: "down" as const,
      placement: "bottom" as const
    },
    {
      targetId: "anchor-stage",
      title: "Define Your Hug",
      content: "Start by defining who your message is for and how you want them to feel.",
      direction: "up" as const,
      placement: "top" as const
    }
  ];

  return (
    <div className="text-slate-800 min-h-screen p-4">
      <div id="stage-navigation" className="relative">
        <StageNavigation 
          currentStage={currentStage} 
          onStageClick={setCurrentStage}
        />
        <DirectionArrow 
          direction="down" 
          className="absolute top-20 left-1/2 transform -translate-x-1/2"
          color="text-indigo-500"
          size="md"
          label="Follow the steps"
          tooltip="Complete each stage to create your Soul Hug"
        />
      </div>
      
      <div className="flex items-center justify-center">
        {currentStage === 'intention' && (
          <div id="anchor-stage" className="relative">
            <AnchorStage 
              onSubmit={handleAnchorSubmit}
              isLoading={isLoading}
            />
            <DirectionArrow 
              direction="up" 
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2"
              color="text-indigo-500"
              label="Start here"
            />
          </div>
        )}
        
        {currentStage === 'reflection' && state.session && (
          <div id="palette-stage" className="relative">
            <PaletteStage
              session={state.session}
              onOpenModal={openModal}
              onRemoveIngredient={removeIngredient}
              onUpdateDescriptors={(descriptors) => {
                updateSession({
                  descriptors
                } as any);
              }}
              onAddIngredient={handleAddDraggedIngredient}
              onBack={() => setCurrentStage('intention')}
              onContinue={() => setCurrentStage('expression')}
            />
            <DirectionArrow 
              direction="left" 
              className="absolute top-1/2 -left-10 transform -translate-y-1/2"
              color="text-indigo-500"
              label="Add ingredients"
              tooltip="Drag prompts or write your own stories"
            />
          </div>
        )}
        
        {currentStage === 'expression' && state.session && (
          <div id="loom-stage" className="relative">
            <LoomStage
              session={state.session}
              onBack={() => setCurrentStage('reflection')}
              onStartOver={startOver}
              onAIWeave={handleAIWeave}
              onAIStitch={handleAIStitch}
              onUpdateMessage={(message) => updateSession({ finalMessage: message })}
              onContinueToAudio={() => setCurrentStage('audio')}
              isLoading={isLoading}
            />
            <DirectionArrow 
              direction="right" 
              className="absolute top-1/3 -right-10 transform -translate-y-1/2"
              color="text-indigo-500"
              label="Craft message"
              tooltip="Write your message or let AI help you"
            />
          </div>
        )}
        
        {currentStage === 'audio' && state.session && (
          <div id="audio-stage" className="relative w-full">
            <AudioHug />
            <DirectionArrow 
              direction="up" 
              className="absolute top-24 right-10"
              color="text-indigo-500"
              label="Audio options"
              tooltip="Record your voice or use AI narration"
            />
          </div>
        )}
      </div>
      
      <IngredientModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleAddIngredient}
        promptText={currentPrompt}
      />
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-morphism rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-800 font-medium">Creating your personalized prompts...</p>
          </div>
        </div>
      )}

      <GuidedTour 
        steps={tourSteps} 
        isOpen={showTour}
        onOpenChange={setShowTour}
        storageKey="creative-flow-tour-completed"
      />

      <button 
        onClick={() => setShowTour(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors"
        title="Show Guide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
}