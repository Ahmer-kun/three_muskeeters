export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export interface GeneratedContentState {
  text: string;
  loading: boolean;
  error: string | null;
}

export enum Section {
  HERO = 'hero',
  WISHES = 'wishes',
  TRIVIA = 'trivia',
  GALLERY = 'gallery',
}