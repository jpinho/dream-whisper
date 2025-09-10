import { Category } from './types';

export const MUSIC_TRACKS = {
  HOME: 'https://www.chosic.com/wp-content/uploads/2021/05/inspiring-and-upbeat-music.mp3',
  FANTASY: 'https://www.chosic.com/wp-content/uploads/2022/01/And-So-It-Begins.mp3',
  ADVENTURE: 'https://www.chosic.com/wp-content/uploads/2024/01/The-Epic-2.mp3',
  ANIMALS: 'https://www.chosic.com/wp-content/uploads/2021/04/Once-Upon-a-Time.mp3',
  MYSTERY: 'https://www.chosic.com/wp-content/uploads/2020/08/cinematic-documentary-piano.mp3',
  SPACE: 'https://www.chosic.com/wp-content/uploads/2023/07/Interstellar-Journey.mp3',
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