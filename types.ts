export enum GameState {
  Welcome,
  Loading,
  Memorize,
  ModeSelection,
  Challenge, // Fill in the blanks
  Scramble,
  MultipleChoice,
  FirstLetter,
  Dictation,
  Result,
}

export enum GameMode {
  FillInTheBlanks,
  Scramble,
  MultipleChoice,
  FirstLetter,
  Dictation,
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