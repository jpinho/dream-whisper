import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { StoryIdea } from '../types';

interface StorySelectorProps {
  title: string;
  ideas: StoryIdea[];
  onSelect: (title: string) => void;
  isLoading: boolean;
  onBack: () => void;
}

const StorySelector: React.FC<StorySelectorProps> = ({ title, ideas, onSelect, isLoading, onBack }) => {
  if (isLoading && ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner />
        <p className="mt-4 text-lg text-slate-300">Dreaming up some ideas...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-2 text-center">{title}</h2>
      <p className="text-lg text-slate-300 mb-8 text-center">Pick a story to start our journey.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        {ideas.map((idea, index) => (
          <Card key={index} onClick={() => onSelect(idea.title)} disabled={isLoading} isActionCard>
            <img src={idea.imageUrl} alt={idea.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-lg text-white font-semibold text-center">{idea.title}</p>
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={onBack} disabled={isLoading} variant="secondary">
        Pick another category
      </Button>
    </div>
  );
};

export default StorySelector;