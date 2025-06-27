import { Button } from "@/components/ui/button";
import type { CreativeFlowSession } from "@shared/schema";

interface PaletteStageProps {
  session: CreativeFlowSession;
  onOpenModal: (promptText: string) => void;
  onRemoveIngredient: (ingredientId: number) => void;
  onUpdateDescriptors: (descriptors: string[]) => void;
  onAddIngredient: (ingredient: { prompt: string; content: string }) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function PaletteStage({ 
  session, 
  onOpenModal, 
  onRemoveIngredient, 
  onUpdateDescriptors,
  onAddIngredient,
  onBack, 
  onContinue 
}: PaletteStageProps) {
  const aiPrompts = session.aiGeneratedPrompts || [];
  const ingredients = session.ingredients || [];
  const descriptors = session.descriptors || [];

  return (
    <div className="w-full max-w-6xl m-auto glass-morphism rounded-2xl shadow-2xl p-8 sm:p-12 fade-in">
      <div className="text-center mb-8">
        <div className="mb-6">
          <i className="fas fa-search text-4xl text-purple-500 mb-4"></i>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            GATHER YOUR INGREDIENTS
          </h1>
        </div>
      </div>
      
      <div className="glass-secondary p-6 rounded-lg border border-white/50 space-y-8">

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-slate-800">
            Click to write a story • Drag to add as ingredient
          </h2>
          
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiPrompts.map((prompt) => (
              <div
                key={prompt.id}
                onClick={() => onOpenModal(prompt.text)}
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', prompt.text);
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'prompt',
                    prompt: prompt.text,
                    content: '' // Empty content to avoid duplication
                  }));
                }}
                className="prompt-card bg-white/90 hover:bg-white border border-slate-200/80 hover:border-slate-300 p-4 rounded-lg shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{prompt.icon}</span>
                    <span className="text-slate-700 font-medium">{prompt.text}</span>
                  </div>
                  <div className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to write • Drag to add
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        

        <div className="w-full flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4 text-center text-slate-800">
              <i className="fas fa-layer-group text-indigo-500 mr-3"></i>
              Your Ingredients
            </h2>
            <div 
              className="bg-slate-100/70 p-4 rounded-lg border-2 border-dashed border-slate-300/80 min-h-[20rem] relative transition-colors"
              onDrop={(e) => {
                e.preventDefault();
                const jsonData = e.dataTransfer.getData('application/json');
                if (jsonData) {
                  try {
                    const data = JSON.parse(jsonData);
                    if (data.type === 'prompt') {
                      // Add prompt directly as an ingredient
                      onAddIngredient({
                        prompt: data.prompt,
                        content: data.content
                      });
                    }
                  } catch (error) {
                    console.error('Error parsing dropped data:', error);
                  }
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-indigo-400', 'bg-indigo-50/50');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('border-indigo-400', 'bg-indigo-50/50');
              }}
            >
              <div className="custom-scrollbar h-60 overflow-y-auto space-y-3 pr-2">
                {ingredients.length === 0 ? (
                  <p className="text-slate-500 text-center mt-16">
                    Your stories and dragged prompts will appear here.
                  </p>
                ) : (
                  ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="ingredient-card bg-white/80 p-4 rounded-lg border border-slate-200 shadow-sm"
                      draggable="true"
                    >
                      <div className="flex items-start space-x-3">
                        <i className="fas fa-lightbulb text-yellow-400 mt-1"></i>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 mb-1">{ingredient.prompt}</h4>
                          <p className="text-sm text-slate-600">{ingredient.content}</p>
                          <button
                            className="text-xs text-red-500 hover:text-red-700 mt-2"
                            onClick={() => onRemoveIngredient(ingredient.id)}
                          >
                            <i className="fas fa-trash mr-1"></i>Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {descriptors.length > 0 && (
                  <div className="ingredient-card bg-white/80 p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-heart text-pink-400 mt-1"></i>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 mb-1">Selected descriptors</h4>
                        <div className="flex flex-wrap gap-2">
                          {descriptors.map((descriptor, index) => (
                            <span
                              key={index}
                              className="inline-flex px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium whitespace-nowrap min-w-fit"
                            >
                              {descriptor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  <i className="fas fa-layer-group mr-1"></i>
                  {ingredients.length + (descriptors.length > 0 ? 1 : 0)} ingredients
                </span>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-center text-slate-800">
              <i className="fas fa-heart text-pink-500 mr-3"></i>
              Descriptors
            </h2>
            <div className="bg-slate-100/70 p-6 rounded-lg border-2 border-dashed border-slate-300/80 min-h-[20rem]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  'Smart', 'Caring', 'Loyal', 'Funny',
                  'Patient', 'Brave', 'Creative', 'Thoughtful',
                  'Strong', 'Loving', 'Honest', 'Supportive',
                  'Kind', 'Wise', 'Generous', 'Inspiring',
                  'Reliable', 'Adventurous', 'Compassionate', 'Witty',
                  'Determined', 'Gentle', 'Optimistic', 'Genuine',
                  'Resilient', 'Playful'
                ].map((descriptor) => {
                  const isSelected = descriptors.includes(descriptor);
                  return (
                    <button
                      key={descriptor}
                      onClick={() => {
                        const newDescriptors = isSelected
                          ? descriptors.filter(d => d !== descriptor)
                          : [...descriptors, descriptor];
                        onUpdateDescriptors(newDescriptors);
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 text-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transform scale-105'
                          : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200 hover:from-indigo-200 hover:to-purple-200 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && <i className="fas fa-check mr-1"></i>}
                      {descriptor}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 mt-8">
        <Button
          onClick={onBack}
          variant="secondary"
          className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-slate-700 transition-all"
        >
          <i className="fas fa-arrow-left mr-2"></i>Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={ingredients.length === 0}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-arrow-right mr-2"></i>Craft
        </Button>
      </div>
    </div>
  );
}