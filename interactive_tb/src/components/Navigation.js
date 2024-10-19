import React from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import './Navigation.css';

const Navigation = ({ onNext, onPrev, isFirstPage, isLastPage, prevPageName, nextPageName }) => (
  <div className="navigation">
    <button
      onClick={onPrev}
      disabled={isFirstPage}
      className="nav-button prev-button"
      aria-label={isFirstPage ? 'First page' : `Go to ${prevPageName}`}
      title={isFirstPage ? 'First page' : `Go to ${prevPageName}`}
    >
      <MdArrowBackIos size={24} />
      <span>{prevPageName}</span>
    </button>
    <button
      onClick={onNext}
      disabled={isLastPage}
      className="nav-button next-button"
      aria-label={isLastPage ? 'Last page' : `Go to ${nextPageName}`}
      title={isLastPage ? 'Last page' : `Go to ${nextPageName}`}
    >
      <span>{nextPageName}</span>
      <MdArrowForwardIos size={24} />
    </button>
  </div>
);

export default Navigation;
