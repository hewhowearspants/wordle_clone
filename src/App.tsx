import React, { Component } from 'react';
import { allowedWords, words } from './words';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import GameOverModal from './GameOverModal';

import {
  AnalysisArray,
  WordArray,
  Board,
  AnalyzedBoard,
  AnalysisColorsEnum,
  SpecialCharactersEnum,
  SOLVED_ANALYSIS_ARRAY,
  STARTING_BOARD,
  MAX_GUESSES,
} from './types';

interface State {
  board: Board,
  analyzedBoard: AnalyzedBoard,
  currentSolution: string,
  currentGuess: number,
  currentWord: WordArray,
  currentWordValid: boolean,
  gameWon: boolean,
  showModal: boolean,
  usedLetters: { [key: string]: string },
}

class App extends Component {
  state = {
    board: STARTING_BOARD,
    analyzedBoard: [],
    currentSolution: '',
    currentGuess: 0,
    currentWord: [],
    currentWordValid: true,
    gameWon: false,
    showModal: false,
    usedLetters: {},
  } as State;

  componentDidMount() {
    window.addEventListener('keydown', this.updateCurrentWord);

    const solutionIndex = Math.floor(Math.random() * words.length);
    const currentSolution = words[solutionIndex];
    this.setState({ currentSolution });
  }

  componentDidUpdate(_, prevState) {
    if (
      (prevState.currentGuess !== MAX_GUESSES && this.state.currentGuess === MAX_GUESSES)
      || (!prevState.gameWon && this.state.gameWon)
    ) {
      window.removeEventListener('keydown', this.updateCurrentWord);
      this.setState({ showModal: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.updateCurrentWord);
  }

  updateCurrentWord = ({ key }) => {
    const { currentWord, currentWordValid, currentGuess } = this.state;
    let newCurrentWord = [ ...currentWord ];

    if (key.length === 1 && (/[a-z]/).test(key) && currentWord.length < 5) {
      newCurrentWord.push(key);
      this.setState({ currentWord: newCurrentWord });
      this.updateBoard([ ...newCurrentWord ]);
  
      if (newCurrentWord.length === 5) {
        let wordIsInList = words.includes(newCurrentWord.join(''));
        if (!wordIsInList) {
          wordIsInList = allowedWords.includes(newCurrentWord.join(''));
        }
        if (!wordIsInList) {
          this.setState({ currentWordValid: false });
        }
      }
    }

    if (key === SpecialCharactersEnum.Backspace) {
      if (newCurrentWord.length > 0) {
        if (!currentWordValid) {
          this.setState({ currentWordValid: true });
        }
        newCurrentWord.pop();
        this.setState({ currentWord: newCurrentWord });
        this.updateBoard([ ...newCurrentWord ]);
      }
    }

    if (key === SpecialCharactersEnum.Enter) {
      if (currentGuess < MAX_GUESSES) {
        if (currentWord.length === 5 && currentWordValid) {
          this.checkGuess();
          newCurrentWord = [];
          this.setState({
            currentWord: newCurrentWord,
          }, () => {
            this.setState({ currentGuess: currentGuess + 1 });
          });
        }
      } else {
        this.setState({
          showModal: true
        });
        // save results to localStorage
      }
    }
  }

  updateBoard = (newCurrentWord) => {
    const { board, currentGuess } = this.state;

    if (newCurrentWord.length < 5) {
      while (newCurrentWord.length < 5) {
        newCurrentWord.push('');
      }
    }
    board[currentGuess] = newCurrentWord;
    this.setState({ board });
  }

  checkGuess = () => {
    const { currentWord, currentSolution } = this.state;
  
    if (currentWord.join('').toLowerCase() === currentSolution) {
      this.setState({ 
        analyzedBoard: [ ...this.state.analyzedBoard, SOLVED_ANALYSIS_ARRAY ],
        currentGuess: -1,
        gameWon: true,
      });
      window.removeEventListener('keydown', this.updateCurrentWord);
    } else {
      this.analyzeWord();
    }
  }

  analyzeWord = (currentWord = this.state.currentWord) => {
    const { currentSolution, analyzedBoard, usedLetters } = this.state;
    const solutionArray = currentSolution.split('');
    const newUsedLetters = { ...usedLetters };

    const wordAnalysis = currentWord.map((letter, index, array) => {
      if (currentSolution[index] === letter) {
        solutionArray[index] = '';
        newUsedLetters[letter] = AnalysisColorsEnum.Green;
        return AnalysisColorsEnum.Green;
      } else {
        if (!newUsedLetters[letter]) newUsedLetters[letter] = AnalysisColorsEnum.Black;
        return AnalysisColorsEnum.Black;
      }
    }) as AnalysisArray;

    wordAnalysis.forEach((status, index) => {
      const letter = currentWord[index];
      if (status !== 'green' && solutionArray.includes(letter)) {
        const letterIndex = solutionArray.findIndex(solutionLetter => solutionLetter === letter);
        solutionArray[letterIndex] = '';
        wordAnalysis[index] = AnalysisColorsEnum.Yellow;
        if (!newUsedLetters[letter] || newUsedLetters[letter] === AnalysisColorsEnum.Black) newUsedLetters[letter] = AnalysisColorsEnum.Yellow;
      }
    });

    this.setState({
      analyzedBoard: [ ...analyzedBoard, wordAnalysis ],
      usedLetters: newUsedLetters,
    });
  }
  
  render() {
    const {
      board,
      analyzedBoard,
      currentWord,
      currentWordValid,
      currentGuess,
      currentSolution,
      gameWon,
      showModal,
      usedLetters,
    } = this.state;

    const disableKeyboardEnter = currentWord.length < 5 || !currentWordValid;
  
    return (
      <div className="App">
        <header className="App-header">
          <div className="header-buttons-left" />
          <div className="header-title">
            A WORDLE CLONE
          </div>
          <div className="header-buttons-right">
            {(gameWon || currentGuess === MAX_GUESSES) && (
              <span className='results-modal-button' onClick={() => this.setState({ showModal: true })}>
                <i className="fa-solid fa-chart-simple" />
              </span>
            )}
          </div>
        </header>
        <div className="App-content">
          <GameBoard
            board={board}
            analyzedBoard={analyzedBoard}
            currentGuess={currentGuess}
            gameWon={gameWon}
            currentWordValid={currentWordValid}
          />
          <Keyboard
            updateCurrentWord={this.updateCurrentWord}
            disableKeyboardEnter={disableKeyboardEnter}
            usedLetters={usedLetters}
          />
          {showModal && (
            <GameOverModal
              analyzedBoard={analyzedBoard}
              currentGuess={currentGuess}
              gameWon={gameWon}
              setShowModal={(show) => this.setState({ showModal: show })}
              solution={currentSolution}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
