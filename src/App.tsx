import React, { Component } from 'react';
import { allowedWords, words } from './words';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';

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
  } as State;

  componentDidMount() {
    window.addEventListener('keydown', this.updateCurrentWord);

    const solutionIndex = Math.floor(Math.random() * words.length);
    const currentSolution = words[solutionIndex];
    this.setState({ currentSolution });
  }

  componentDidUpdate(_, prevState) {
    if (this.state.currentGuess === MAX_GUESSES) {
      window.removeEventListener('keydown', this.updateCurrentWord);
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
        // show YOU LOSE
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
    const { currentSolution, analyzedBoard } = this.state;
    const solutionArray = currentSolution.split('');
    const wordAnalysis = currentWord.map((letter, index, array) => {
      if (currentSolution[index] === letter) {
        solutionArray[index] = '';
        return AnalysisColorsEnum.Green;
      } else {
        return AnalysisColorsEnum.Black;
      }
    }) as AnalysisArray;
    wordAnalysis.forEach((status, index) => {
      const letter = currentWord[index];
      if (status !== 'green' && solutionArray.includes(letter)) {
        const letterIndex = solutionArray.findIndex(solutionLetter => solutionLetter === letter);
        solutionArray[letterIndex] = '';
        wordAnalysis[index] = AnalysisColorsEnum.Yellow;
      }
    })
    this.setState({ analyzedBoard: [ ...analyzedBoard, wordAnalysis ]});
  }
  
  render() {
    const {
      board,
      analyzedBoard,
      currentWord,
      currentWordValid,
      currentGuess,
      gameWon,
    } = this.state;

    let message = '';
    if (!currentWordValid) {
      message = 'Not in word list'
    } else if (gameWon) {
      message = 'YOU WON, BUTTMUNCH!!'
    }

    if (message) {
      console.log(message);
    }

    const disableKeyboardEnter = currentWord.length < 5 || !currentWordValid;
  
    return (
      <div className="App">
        <header className="App-header">
          <div className="header-title">
            A WORDLE CLONE
          </div>
        </header>
        <div className="App-content">
          <GameBoard
            board={board}
            analyzedBoard={analyzedBoard}
            currentGuess={currentGuess}
            gameWon={gameWon}
            currentWordValid={currentWordValid}
            message={message}
          />
          <Keyboard updateCurrentWord={this.updateCurrentWord} disableKeyboardEnter={disableKeyboardEnter} />
        </div>
      </div>
    );
  }
}

export default App;
