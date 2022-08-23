import React, { FC } from 'react';

import { KEYBOARD_LAYOUT, SpecialCharactersEnum } from './types';

const layout = KEYBOARD_LAYOUT;

const letterMap = {
  [SpecialCharactersEnum.Enter]: '⏎',
  [SpecialCharactersEnum.Backspace]: '⌫',
}

interface Props {
  updateCurrentWord: Function,
  disableKeyboardEnter: boolean,
  usedLetters: { [key: string]: string },
}

const Keyboard: FC<Props> = ({ updateCurrentWord, disableKeyboardEnter, usedLetters }) => {
  return (
    <div className='keyboard'>
      {layout.map((row, index) => (
        <div className={`row ${'row' + (index + 1)}`} key={'row' + index}>
          {row.map(letter => (
            <button
              className={`key ${usedLetters[letter] ? usedLetters[letter] : ''}`}
              id={letter}
              key={letter}
              onClick={() => updateCurrentWord({ key: letter })}
              disabled={letter === SpecialCharactersEnum.Enter && disableKeyboardEnter}
            >
              {letterMap[letter] ? letterMap[letter] : letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Keyboard;