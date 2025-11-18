export enum GameState {
  Welcome,
  Loading,
  Memorize,
  ModeSelection,
  LearningPlan,
  Challenge, // Fill in the blanks
  Scramble,
  MultipleChoice,
  FirstLetter,
  Reconstruct,
  Result,
}

export enum GameMode {
  FillInTheBlanks,
  Scramble,
  MultipleChoice,
  FirstLetter,
  Reconstruct,
}

export interface MultipleChoiceOption {
  answer: string;
  distractors: string[];
}

export interface ChallengeData {
  originalVerse: string;
  reference: string;
  challengeTemplate: string[];
  answers: string[];
  orderedChunks: string[];
  multipleChoiceOptions: MultipleChoiceOption[];
  firstLetters: string;
}