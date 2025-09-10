import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Story, StoryStep, Category } from './types';
import { getStoryIdeas, startStory, continueStory, finishStory } from './services/geminiService';
import CategorySelector from './components/CategorySelector';
import StorySelector from './components/StorySelector';
import StoryView from './components/StoryView';
import StoryEndScreen from './components/StoryEndScreen';
import HistoryView from './components/HistoryView';
import AudioPlayer from './components/AudioPlayer';
import HomeIcon from './components/icons/HomeIcon';
import BookIcon from './components/icons/BookIcon';
import { STORY_CATEGORIES, MUSIC_TRACKS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.CATEGORY_SELECT);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [storyIdeas, setStoryIdeas] = useState<string[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [storyHistory, setStoryHistory] = useLocalStorage<Story[]>('storyHistory', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const musicTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState === GameState.CATEGORY_SELECT) {
      setMusicUrl(MUSIC_TRACKS.HOME);
      setIsPlaying(true);
    }
    return () => {
      if (musicTimeoutRef.current) {
        clearTimeout(musicTimeoutRef.current);
      }
    };
  }, [gameState]);

  const handleCategorySelect = async (category: Category) => {
    setIsLoading(true);
    setError(null);
    try {
      const ideas = await getStoryIdeas(category.name);
      setCurrentCategory(category);
      setStoryIdeas(ideas);
      setGameState(GameState.STORY_SELECT);
    } catch (err) {
      setError('Could not get story ideas. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStorySelect = async (title: string) => {
    if (!currentCategory) return;
    setIsLoading(true);
    setError(null);
    try {
      const { storyPart, choices, imageUrl, characterDescription } = await startStory(title);
      const newStory: Story = {
        title,
        category: currentCategory.name,
        steps: [{ part: storyPart, image: imageUrl, choiceMade: '' }],
        choices,
        characterDescription,
      };
      setCurrentStory(newStory);
      setMusicUrl(currentCategory.music);
      setIsPlaying(true);
      setGameState(GameState.STORY_TELLING);
    } catch (err) {
      setError('Could not start the story. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelect = async (choice: string) => {
    if (!currentStory) return;
    setIsLoading(true);
    setError(null);

    const storySoFar = currentStory.steps.map(s => `> ${s.choiceMade}\n${s.part}`).join('\n\n');

    try {
      const { storyPart, choices, imageUrl } = await continueStory(currentStory.title, storySoFar, choice, currentStory.characterDescription);
      const newStep: StoryStep = { part: storyPart, image: imageUrl, choiceMade: choice };
      
      const updatedStory: Story = {
        ...currentStory,
        steps: [...currentStory.steps, newStep],
        choices: choices,
      };

      setCurrentStory(updatedStory);

      if (choices.length === 0) {
        setStoryHistory([updatedStory, ...storyHistory]);
        setGameState(GameState.STORY_END);
        
        if (musicTimeoutRef.current) clearTimeout(musicTimeoutRef.current);
        musicTimeoutRef.current = window.setTimeout(() => {
            setIsPlaying(false);
        }, 20 * 60 * 1000); // 20 minutes
      }
    } catch (err) {
      setError('Could not continue the story. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishStory = async () => {
    if (!currentStory) return;
    setIsLoading(true);
    setError(null);

    const storySoFar = currentStory.steps.map(s => `> ${s.choiceMade}\n${s.part}`).join('\n\n');
    try {
        const { storyPart, imageUrl } = await finishStory(currentStory.title, storySoFar, currentStory.characterDescription);
        const finalStep: StoryStep = { part: storyPart, image: imageUrl, choiceMade: 'And they all lived happily ever after.' };
        
        const updatedStory: Story = {
            ...currentStory,
            steps: [...currentStory.steps, finalStep],
            choices: [],
        };

        setCurrentStory(updatedStory);
        setStoryHistory([updatedStory, ...storyHistory]);
        setGameState(GameState.STORY_END);
        
        if (musicTimeoutRef.current) clearTimeout(musicTimeoutRef.current);
        musicTimeoutRef.current = window.setTimeout(() => {
            setIsPlaying(false);
        }, 20 * 60 * 1000); // 20 minutes
    } catch (err) {
        setError('Could not finish the story. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };


  const resetToHome = () => {
    setGameState(GameState.CATEGORY_SELECT);
    setCurrentStory(null);
    setCurrentCategory(null);
    setStoryIdeas([]);
    setError(null);
    setMusicUrl(MUSIC_TRACKS.HOME);
    setIsPlaying(true);
    if (musicTimeoutRef.current) {
        clearTimeout(musicTimeoutRef.current);
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.CATEGORY_SELECT:
        return <CategorySelector categories={STORY_CATEGORIES} onSelect={handleCategorySelect} isLoading={isLoading} />;
      case GameState.STORY_SELECT:
        return <StorySelector title={`Choose a story about ${currentCategory?.name.toLowerCase()}`} ideas={storyIdeas} onSelect={handleStorySelect} isLoading={isLoading} onBack={resetToHome} />;
      case GameState.STORY_TELLING:
        return currentStory ? <StoryView story={currentStory} onSelectChoice={handleChoiceSelect} onFinishStory={handleFinishStory} isLoading={isLoading} /> : null;
      case GameState.STORY_END:
        return <StoryEndScreen onGoHome={resetToHome} />;
      case GameState.HISTORY_VIEW:
        return <HistoryView stories={storyHistory} onSelectStory={setCurrentStory} onBack={() => setGameState(GameState.CATEGORY_SELECT)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white p-4 sm:p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetToHome}>
          <svg className="w-8 h-8 text-yellow-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/></svg>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-yellow-300">DreamWeaver</h1>
        </div>
        <nav className="flex items-center gap-4">
          <button onClick={resetToHome} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Home"><HomeIcon /></button>
          <button onClick={() => setGameState(GameState.HISTORY_VIEW)} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Story History"><BookIcon /></button>
        </nav>
      </header>
      <main className="w-full max-w-4xl flex-grow">
        {error && <div className="bg-red-500/80 p-4 rounded-lg mb-4 text-center">{error}</div>}
        {renderContent()}
      </main>
      <AudioPlayer src={musicUrl} isPlaying={isPlaying} />
    </div>
  );
};

export default App;