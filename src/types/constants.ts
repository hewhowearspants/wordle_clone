export enum AnalysisColorsEnum {
  Black = 'black',
  Yellow = 'yellow',
  Green = 'green',
}

export enum SpecialCharactersEnum {
  Enter = 'Enter',
  Backspace = 'Backspace',
}

export enum WordClasses {
  Current = 'current',
  Guessed = 'guessed',
  Invalid = 'invalid',
}

export enum PageDirections {
  Back = 'back',
  Forward = 'forward',
}

export enum HistoryResultsPages {
  Daily = 'daily',
  Graph = 'graph',
}

export enum ModalTypes {
  Today = 'today',
  Daily = 'daily',
  Graph = 'graph',
}

export const SOLVED_ANALYSIS_ARRAY = [
  AnalysisColorsEnum.Green,
  AnalysisColorsEnum.Green,
  AnalysisColorsEnum.Green,
  AnalysisColorsEnum.Green,
  AnalysisColorsEnum.Green
];

export const STARTING_BOARD = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];

export const MAX_GUESSES = 6;

export const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [SpecialCharactersEnum.Enter, 'z', 'x' ,'c' ,'v' ,'b' ,'n' ,'m', SpecialCharactersEnum.Backspace],
];

export const SAVED_STATE_KEY = 'edwordsSavedState';

export const HISTORY_DATA_KEY = 'edwordsHistory'

export const COLOR_SQUARES_MAP = {
  [AnalysisColorsEnum.Green]: '🟩',
  [AnalysisColorsEnum.Yellow]: '🟨',
  [AnalysisColorsEnum.Black]: '⬛️',
}