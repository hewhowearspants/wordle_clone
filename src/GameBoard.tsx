import React, { FC } from 'react';

import {
  AnalyzedBoard,
  Board,
  WordClasses,
} from './types';

interface Props {
  board: Board,
  analyzedBoard: AnalyzedBoard,
  currentGuess: number,
  gameWon: boolean,
  currentWordValid: boolean,
}

const GameBoard: FC<Props> = ({ board, analyzedBoard, currentGuess, gameWon, currentWordValid }) => {
  const renderBoard = () => {
    return board.map((word, index) => { 
      const analyzedWord = analyzedBoard[index];
      const wordWasGuessed: boolean = !!analyzedWord;
      const wordIsCurrent: boolean = index === currentGuess;
      
      let wordClassAddendum = '';
      if (wordIsCurrent && !gameWon) {
        wordClassAddendum += ` ${WordClasses.Current}`;
      }
      if (wordWasGuessed) {
        wordClassAddendum += ` ${WordClasses.Guessed}`;
      }
      if (wordIsCurrent && !currentWordValid) {
        wordClassAddendum += ` ${WordClasses.Invalid}`;
      }
      
      return (
        <div className={`word word-${index}${wordClassAddendum}`} key={`word-${index}`}>
          {word.map((letter, i) => (
            <div className={`letter letter-${i} ${analyzedWord ? analyzedWord[i] : ''}`} key={`letter-${i}`}>
              {letter.toUpperCase()}
            </div>
          ))}
        </div>
      )
    });
  }

  return (
    <div className='game-board'>
      {renderBoard()}
    </div>
  )
}

export default GameBoard;