import React, { FC, useContext } from 'react';
import { ModalContext } from '../App';

import { COLOR_SQUARES_MAP } from '../types';
import { copyToClipboard } from '../util';



const TodayResults: FC = () => {
  const {
    analyzedBoard,
    currentGuess,
    gameWon,
    solution,
    resetGame,
  } = useContext(ModalContext);

  const messageMap = {
    1: 'You cheated.',
    2: 'Wow! Awesome!',
    3: 'Very Nice',
    4: 'Good Job',
    5: 'You Got It',
    6: 'Whew! Barely!',
  }

  let message = gameWon ? messageMap[currentGuess] : 'Haha, You Suck';

  const analyzedBoardSquares = analyzedBoard.map((row) => (
    row.map((color) => (
      COLOR_SQUARES_MAP[color]
    ))
  ));

  const squaresString = analyzedBoard.reduce((squares, row) => {
    squares += `${row.map(color => COLOR_SQUARES_MAP[color]).join('')}\n`
    return squares;
  }, '');

  return (
    <div className="today-results">
      <div className='message'>
        <p className='message-text'>{message}</p>
      </div>
      <div className='results'>
        <div className="results-container">
          {analyzedBoardSquares.map((row, index) => (
            <div className='results-row' key={`results-row-${index}`}>
              {row.map((colorSquare, idx) => (
                <span className='results-square' key={`results-square-${idx}`}>
                  {colorSquare}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="results-solution">{solution.toUpperCase()}</p>
      </div>
      <div className='share-results'>
        <button onClick={() => copyToClipboard(squaresString)}>
          Copy Results
        </button>
        <button onClick={() => resetGame()}>
          New Game
        </button>
      </div>
    </div>
  )
}

export default TodayResults;