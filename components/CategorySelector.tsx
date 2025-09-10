
import React from 'react';
import { Category } from '../types';
import Card from './common/Card';
import SparkleIcon from './icons/SparkleIcon';

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  isLoading: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onSelect, isLoading }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-2">Let's Begin a New Story!</h2>
        <p className="text-lg text-slate-300">What kind of adventure will we have tonight?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {categories.map((category) => (
          <Card key={category.name} onClick={() => onSelect(category)} disabled={isLoading} isActionCard>
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-5xl mb-3">{category.emoji}</span>
              <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
              <p className="text-slate-300">{category.description}</p>
              <div className="mt-4 flex items-center gap-2 text-yellow-400">
                <SparkleIcon />
                <span>Choose Me!</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
