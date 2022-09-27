import { AnalysisColorsEnum } from "./constants";

export type WordArray = Array<string>;

export type AnalysisArray = Array<AnalysisColorsEnum>;

export type Board = Array<WordArray>;

export type AnalyzedBoard = Array<AnalysisArray>;

export interface PreviousResult {
  timestamp: number,
  word: string,
  results: AnalyzedBoard,
  gameWon: boolean;
}

export type PreviousResults = Array<PreviousResult>;

export interface IModalContext {
  analyzedBoard: AnalyzedBoard;
  currentGuess: number;
  gameWon: boolean;
  gameOver: boolean;
  solution: string;
  resetGame: Function;
  showModal: boolean;
  setShowModal: Function;
  previousResults: PreviousResults;
}