import React, { FC, useState, useEffect, useContext } from 'react';
import { ModalContext } from '../App';

const GuessesGraph: FC = () => {
  const { previousResults } = useContext(ModalContext);
  const [ guessesBreakdown, setGuessesBreakdown ] = useState(new Map());
  const [ gamesWon, setGamesWon ] = useState(0);
  const [ winningStreak, setWinningStreak ] = useState(0);

  useEffect(() => {
    let breakdown = new Map();
    let won = 0;
    let streak = 0;

    for (let i = 1; i <= 6; i++) {
      breakdown.set(i, 0);
    }

    previousResults.forEach(({ results, gameWon }) => {
      if (gameWon) {
        won++;
        streak++;
      } else {
        streak = 0;
      }

      if (results.length && gameWon) {
        breakdown.set(results.length, breakdown.get(results.length) + 1);
      }
    });

    setGuessesBreakdown(breakdown);
    setGamesWon(won);
    setWinningStreak(streak);
  }, [previousResults]);

  return (
    <div className="guesses-graph">
      <div className="guesses-graph-text">
        <p>Games Played: {previousResults.length}</p>
        <p>Games Won: {gamesWon}</p>
        <p>Streak: {winningStreak}</p>
      </div>
      <div className="graph">
        {Array.from(guessesBreakdown).map(([guessNumber, numberOfGames]) => {
          const percentWidth = (numberOfGames / previousResults.length) * 100;
          return (
            <div className="graph-bar-container" key={guessNumber}>
              <div className="guess-number">{guessNumber}</div>
              <div className="graph-bar" style={{ width: `${percentWidth || 1}%` }}>
                <span className="number-of-games">{numberOfGames}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GuessesGraph;