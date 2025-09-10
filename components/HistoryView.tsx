
import React from 'react';
import { Story } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface HistoryViewProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ stories, onSelectStory, onBack }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-300">Your Storybook</h2>
        <Button onClick={onBack} variant="secondary">Back</Button>
      </div>
      {stories.length === 0 ? (
        <div className="text-center p-8 bg-slate-800/50 rounded-lg">
          <p className="text-xl text-slate-300">You haven't read any stories yet.</p>
          <p className="text-slate-400 mt-2">Let's create your first memory!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <Card key={index} onClick={() => onSelectStory(story)}>
              <div className="p-4 flex flex-col h-full">
                <img src={story.steps[0].image} alt={story.title} className="w-full h-40 object-cover rounded-md mb-4"/>
                <h3 className="text-xl font-bold text-white flex-grow">{story.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{story.category}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
