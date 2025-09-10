export enum GameState {
  CATEGORY_SELECT,
  STORY_SELECT,
  STORY_TELLING,
  STORY_END,
  HISTORY_VIEW
}

export interface Category {
  name: string;
  emoji: string;
  description: string;
  music: string;
}

export interface StoryStep {
  part: string;
  image: string;
  choiceMade: string;
}

export interface Story {
  title: string;
  category: string;
  steps: StoryStep[];
  choices: string[];
  characterDescription?: string;
}