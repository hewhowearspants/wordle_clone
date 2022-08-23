import React, { FC } from 'react';

import Modal from './elements/Modal';

import { AnalysisColorsEnum } from './types';
import { copyToClipboard } from './util';

interface Props {
  analyzedBoard: any,
  currentGuess: number,
  gameWon: any,
  setShowModal: Function,
  solution: string,
}

const colorSquaresMap = {
  [AnalysisColorsEnum.Green]: '🟩',
  [AnalysisColorsEnum.Yellow]: '🟨',
  [AnalysisColorsEnum.Black]: '⬛️',
}

const GameOverModal: FC<Props> = ({ analyzedBoard, currentGuess, gameWon, setShowModal, solution }) => {
  let message = '';
  if (gameWon) {
    switch(currentGuess) {
      case 1:
        message = 'You cheated.';
        break;
      case 2:
        message = 'Wow! Awesome!';
        break;
      case 3:
        message = 'Very Nice';
        break;
      case 4:
        message = 'Good Job';
        break;
      case 5:
        message = 'You Got It';
        break;
      case 6:
      default:
        message = 'Whew! Barely!';
        break;
    }
  } else {
    message = 'Haha, You Suck';
  }

  const analyzedBoardSquares = analyzedBoard.map((row) => (
    row.map((color) => (
      colorSquaresMap[color]
    ))
  ));

  const squaresString = analyzedBoard.reduce((squares, row) => {
    squares += `${row.map(color => colorSquaresMap[color]).join('')}\n`
    return squares;
  }, '');

  return (
    <Modal
      className='game-over-modal'
      onClose={() => setShowModal(false)}
    >
      <div className='message'>
        <p className='message-text'>{message}</p>
        {!gameWon && <p className='message-solution'>{solution.toUpperCase()}</p>}
      </div>
      <div className='results'>
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
      <div className='share-results'>
        <button onClick={() => copyToClipboard(squaresString)}>
          Copy Results
        </button>
      </div>
    </Modal>
  )
}

export default GameOverModal;