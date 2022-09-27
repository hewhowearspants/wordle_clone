import React, { FC } from 'react';

interface Props {
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
  show: boolean;
}

const Modal: FC<Props> = ({ className = '', children, onClose, show }) => show ? (
  <div
    className={`modal-wrapper ${className}`}
    onClick={onClose}
  >
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-close-button" onClick={onClose}>
        <i className="fa-solid fa-xmark" />
      </div>
      {children}
    </div>
  </div>
) : null;

export default Modal;