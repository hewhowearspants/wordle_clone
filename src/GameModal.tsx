import React, { FC, useState, useContext, useEffect } from 'react';
import { ModalContext } from './App';
import TodayResults from './gameModal/TodayResults';
import DailyResults from './gameModal/DailyResults';
import GuessesGraph from './gameModal/GuessesGraph';

import Modal from './elements/Modal';

import { ModalTypes } from './types';

const GameModal: FC = () => {
  const { showModal, setShowModal, gameOver, previousResults } = useContext(ModalContext);
  const hasHistory = !!Object.keys(previousResults).length;
  const [currentNav, setCurrentNav] = useState(hasHistory ? ModalTypes.Daily : ModalTypes.Today);

  useEffect(() => {
    if (gameOver) {
      setCurrentNav(ModalTypes.Today);
    } else if (hasHistory) {
      setCurrentNav(ModalTypes.Daily);
    }
  }, [gameOver, hasHistory]);

  const renderModalContent = () => {
    switch (currentNav) {
      case ModalTypes.Today:
        return <TodayResults />
      case ModalTypes.Daily:
        return <DailyResults />
      case ModalTypes.Graph:
        return <GuessesGraph />
      default:
        return null;
    }
  }

  return (
    <Modal
      className='game-modal'
      onClose={() => setShowModal(false)}
      show={showModal}
    >
      <div className="game-modal-nav">
        {!!Object.keys(previousResults).length && (<>
          <i 
            className={`fa-solid fa-table-cells nav-icon ${currentNav === ModalTypes.Daily ? 'selected' : ''}`}
            onClick={() => setCurrentNav(ModalTypes.Daily)}
          />
          <i
            className={`fa-solid fa-chart-bar nav-icon ${currentNav === ModalTypes.Graph ? 'selected' : ''}`}
            onClick={() => setCurrentNav(ModalTypes.Graph)}
          />
        </>)}
        {gameOver && (
          <i
            className={`fa-solid fa-calendar-day nav-icon ${currentNav === ModalTypes.Today ? 'selected' :''}`}
            onClick={() => setCurrentNav(ModalTypes.Today)}
          />
        )}
      </div>
      <div className="game-modal-content">
        {renderModalContent()}
      </div>
    </Modal>
  )
};

export default GameModal;