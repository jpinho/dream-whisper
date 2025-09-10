
import React from 'react';
import Button from './common/Button';

interface StoryEndScreenProps {
  onGoHome: () => void;
}

const StoryEndScreen: React.FC<StoryEndScreenProps> = ({ onGoHome }) => {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in p-8">
      <div className="text-6xl mb-4">✨</div>
      <h2 className="text-4xl font-bold text-yellow-300 mb-2">The End</h2>
      <p className="text-lg text-slate-300 max-w-md mb-6">
        Sweet dreams! The calming music will keep playing for a little while to help you drift off to sleep.
      </p>
      <Button onClick={onGoHome} variant="primary">
        Start a New Story
      </Button>
    </div>
  );
};

export default StoryEndScreen;
