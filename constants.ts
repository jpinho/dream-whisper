import { Category } from './types';

export const MUSIC_TRACKS = {
  HOME: 'https://cdn.pixabay.com/audio/2022/11/17/audio_8529542615.mp3',
  FANTASY: 'https://cdn.pixabay.com/audio/2022/05/27/audio_3433c23924.mp3',
  ADVENTURE: 'https://cdn.pixabay.com/audio/2023/08/03/audio_eb7c132053.mp3',
  ANIMALS: 'https://cdn.pixabay.com/audio/2023/02/10/audio_5532435a29.mp3',
  MYSTERY: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dee654034.mp3',
  SPACE: 'https://cdn.pixabay.com/audio/2022/03/24/audio_386227419e.mp3',
};

export const STORY_CATEGORIES: Category[] = [
  { 
    name: 'Fantasy', 
    emoji: '🧙', 
    description: 'Magic castles and brave knights.',
    music: MUSIC_TRACKS.FANTASY
  },
  { 
    name: 'Adventure', 
    emoji: '🗺️', 
    description: 'Exploring jungles and finding treasure.',
    music: MUSIC_TRACKS.ADVENTURE
  },
  { 
    name: 'Animals', 
    emoji: '🦊', 
    description: 'Stories about friendly talking animals.',
    music: MUSIC_TRACKS.ANIMALS
  },
  {
    name: 'Mystery',
    emoji: '🔎',
    description: 'Solving clues and uncovering secrets.',
    music: MUSIC_TRACKS.MYSTERY
  },
  {
    name: 'Space',
    emoji: '🚀',
    description: 'Traveling to new planets and stars.',
    music: MUSIC_TRACKS.SPACE
  }
];