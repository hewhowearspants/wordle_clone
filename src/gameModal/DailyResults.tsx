import React, { FC, useState, useContext } from 'react';
import dayjs from 'dayjs';
import { ModalContext } from '../App';


import {
  PageDirections,
  COLOR_SQUARES_MAP,
} from '../types';

const DailyResults: FC = () => {
  const { previousResults } = useContext(ModalContext);
  const [index, setIndex] = useState(previousResults.length - 1);

  const { timestamp, word, results, gameWon } = previousResults[index];

  const changePage = (direction) => {
    let nextIndex = index;

    if (direction === PageDirections.Back) {
      nextIndex = index - 1;
      if (nextIndex < 0) {
        nextIndex = previousResults.length - 1;
      }
      setIndex(nextIndex)
    } else if (direction === PageDirections.Forward) {
      nextIndex = index + 1;
      if (nextIndex >= previousResults.length) {
        nextIndex = 0;
      }
    }

    setIndex(nextIndex);
  }

  const analyzedBoardSquares = results.map((row) => (
    row.map((color) => (
      COLOR_SQUARES_MAP[color]
    ))
  ));

  const formattedTime = dayjs(timestamp).format('M/DD/YYYY HH:mm');
  const wonIcon = <i className='fa-solid fa-check won-icon' />;
  const lostIcon = <i className='fa-solid fa-xmark lost-icon' />;

  return (
    <div className="daily-results">
      <p className='results-time'>{formattedTime} {gameWon ? wonIcon : lostIcon}</p>
      <div className='results'>
        <div className='results-container'>
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
        <p className='results-solution'>{word.toUpperCase()}</p>
      </div>
      <div className='page-changer'>
        <span className='page-changer-button left' onClick={() => changePage(PageDirections.Back)}>
          <i className='fas fa-chevron-left' />
        </span>
        <span className='page-changer-button right' onClick={() => changePage(PageDirections.Forward)}>
          <i className='fas fa-chevron-right' />
        </span>
      </div>
    </div>
  )
}

export default DailyResults;