import React from 'react';
import { Story } from '../types';
import Button from './common/Button';
import Spinner from './common/Spinner';

interface StoryViewProps {
  story: Story;
  onSelectChoice: (choice: string) => void;
  onFinishStory: () => void;
  isLoading: boolean;
}

const ImagePlaceholder: React.FC = () => (
    <div className="w-full aspect-video bg-slate-700 rounded-lg flex items-center justify-center animate-pulse">
        <Spinner />
    </div>
);

const StoryView: React.FC<StoryViewProps> = ({ story, onSelectChoice, onFinishStory, isLoading }) => {
  const currentStep = story.steps[story.steps.length - 1];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4 text-center">{story.title}</h2>
      
      <div className="w-full rounded-lg overflow-hidden shadow-2xl shadow-black/30 mb-6">
        {isLoading && story.steps.length > 1 ? (
             <ImagePlaceholder />
        ) : (
            <img src={currentStep.image} alt="Story illustration" className="w-full h-auto object-cover" />
        )}
      </div>

      <div className="bg-black/20 p-6 rounded-lg w-full mb-6">
        <p className="text-lg sm:text-xl leading-relaxed text-slate-200">{currentStep.part}</p>
      </div>

      <div className="w-full">
        {isLoading ? (
            <div className="flex items-center justify-center p-4">
                <Spinner />
                <p className="ml-4 text-lg">Thinking about what happens next...</p>
            </div>
        ) : (
            <>
                {story.choices.length > 0 && <h3 className="text-xl font-bold mb-4 text-center text-yellow-300">What happens next?</h3>}
                <div className="grid grid-cols-1 gap-4">
                {story.choices.map((choice, index) => (
                    <Button 
                        key={index} 
                        onClick={() => onSelectChoice(choice)} 
                        disabled={isLoading}
                        variant="primary"
                        className="text-left justify-start"
                    >
                        {choice}
                    </Button>
                ))}
                {story.choices.length > 0 && (
                    <Button
                        onClick={onFinishStory}
                        disabled={isLoading}
                        variant="secondary"
                        className="mt-2"
                    >
                        Finish the story now
                    </Button>
                )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default StoryView;