import React, { Component, createContext } from 'react';
import { allowedWords, words } from './words';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import GameModal from './GameModal';

import { IModalContext, PreviousResults } from './types';

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
  SAVED_STATE_KEY,
  HISTORY_DATA_KEY,
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

const initialState = {
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

export const ModalContext = createContext({} as IModalContext);

class App extends Component {
  state = initialState;

  componentDidMount() {
    window.addEventListener('keydown', this.updateCurrentWord);

    if (localStorage.getItem(SAVED_STATE_KEY)) {
      const savedStateData = JSON.parse(localStorage.getItem(SAVED_STATE_KEY) as string);
      if (savedStateData.gameWon || savedStateData.currentGuess === MAX_GUESSES) {
        this.resetState();
      } else {
        this.loadState();
      }
    } else {
      this.setState({ currentSolution: this.loadSolution() });
    }
  }

  componentDidUpdate(_, prevState) {
    if (
      (prevState.currentGuess !== MAX_GUESSES && this.state.currentGuess === MAX_GUESSES)
      || (!prevState.gameWon && this.state.gameWon)
    ) {
      window.removeEventListener('keydown', this.updateCurrentWord);
      this.setState({ showModal: true }, this.saveState);
      if (this.state.currentGuess === MAX_GUESSES) {
        this.saveHistory();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.updateCurrentWord);
    this.saveState();
  }

  saveState = () => {
    localStorage.setItem(SAVED_STATE_KEY, JSON.stringify(this.state));
  }

  saveHistory = () => {
    const historyData = localStorage[HISTORY_DATA_KEY] ? JSON.parse(localStorage[HISTORY_DATA_KEY] as string) : { previousWords: {}, previousResults: [] };
    const { previousWords, previousResults } = historyData;
    const { currentSolution, analyzedBoard, gameWon } = this.state;

    previousWords[this.state.currentSolution] = true;
    previousResults.push({
      timestamp: Date.now(),
      results: analyzedBoard,
      word: currentSolution,
      gameWon: gameWon,
    });
    localStorage.setItem(HISTORY_DATA_KEY, JSON.stringify({ previousWords, previousResults }));
  }

  loadState = () => {
    const savedState = localStorage.getItem(SAVED_STATE_KEY);
    this.setState(JSON.parse(savedState as string));
  }

  loadSolution = () => {
    let solutionIndex = Math.floor(Math.random() * words.length);
    let solution = words[solutionIndex];

    if (localStorage[HISTORY_DATA_KEY]) {
      const history = JSON.parse(localStorage[HISTORY_DATA_KEY]);
      while (history.previousWords[solution]) {
        solutionIndex = Math.floor(Math.random() * words.length);
        solution = words[solutionIndex];
      }
    } 

    return solution;
  }

  resetState = () => {
    window.removeEventListener('keydown', this.updateCurrentWord);
    window.addEventListener('keydown', this.updateCurrentWord);

    this.setState({
      ...initialState,
      currentSolution: this.loadSolution(),
    }, this.saveState);
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
          this.analyzeWord();
          newCurrentWord = [];
          this.setState({
            currentWord: newCurrentWord,
          }, () => {
            this.setState({ currentGuess: currentGuess + 1 }, this.saveState);
          });
        }
      }
    }
  }

  updateBoard = (newCurrentWord) => {
    const { board, currentGuess } = this.state;
    const newBoard = [ ...board ];

    if (newCurrentWord.length < 5) {
      while (newCurrentWord.length < 5) {
        newCurrentWord.push('');
      }
    }
    newBoard[currentGuess] = newCurrentWord;
    this.setState({ board: newBoard });
  }

  analyzeWord = () => {
    const { currentWord, currentSolution, analyzedBoard, usedLetters } = this.state;
    const newUsedLetters = { ...usedLetters };
    
    if (currentWord.join('').toLowerCase() === currentSolution) {
      currentWord.forEach(letter => newUsedLetters[letter] = AnalysisColorsEnum.Green);
      this.setState({
        gameWon: true,
        analyzedBoard: [ ...analyzedBoard, SOLVED_ANALYSIS_ARRAY ],
        usedLetters: newUsedLetters,
      }, this.saveHistory);
      return;
    }

    const solutionArray = currentSolution.split('');

    const analyzedWord = currentWord.map((letter, index, array) => {
      if (solutionArray[index] === letter) {
        newUsedLetters[letter] = AnalysisColorsEnum.Green;
        solutionArray[index] = '';
        return AnalysisColorsEnum.Green;
      }

      for (let i = 0; i < array.length; i++) {
        if (solutionArray[i] === letter && currentWord[i] !== letter) {
          solutionArray[i] = '';
          if (!newUsedLetters[letter]) newUsedLetters[letter] = AnalysisColorsEnum.Yellow;
          return AnalysisColorsEnum.Yellow;
        }
      }

      if (!newUsedLetters[letter]) newUsedLetters[letter] = AnalysisColorsEnum.Black;
      return AnalysisColorsEnum.Black;
    }) as AnalysisArray;


    this.setState({
      analyzedBoard: [ ...analyzedBoard, analyzedWord ],
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

    let previousResults = {} as PreviousResults;
    if (localStorage.getItem(HISTORY_DATA_KEY)) {
      previousResults = JSON.parse(localStorage.getItem(HISTORY_DATA_KEY) as string).previousResults as PreviousResults;
    }

    return (
      <div className="App">
        <header className="App-header">
          <div className="header-buttons-left" />
          <div className="header-title">
            EDWORDS
          </div>
          <div className="header-buttons-right">
            {!!Object.keys(previousResults).length && (
              <span className='results-modal-button' onClick={() => this.setState({ showModal: true })} title='Show Results'>
                <i className="fa-solid fa-chart-simple" />
              </span>
            )}
            <span className='new-game-button' onClick={this.resetState} title='New Game'>
              <i className="fa-solid fa-arrows-rotate" />
            </span>
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
          <ModalContext.Provider value={{
            analyzedBoard,
            currentGuess,
            gameWon,
            gameOver: gameWon || currentGuess === MAX_GUESSES,
            solution: currentSolution,
            resetGame: this.resetState,
            showModal,
            setShowModal: (show) => this.setState({ showModal: show }),
            previousResults,
          }}>
            <GameModal />
          </ModalContext.Provider>
        </div>
      </div>
    );
  }
}

export default App;
