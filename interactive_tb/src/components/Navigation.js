import React from 'react';

const Navigation = ({ onNext, onPrev, isFirstPage, isLastPage }) => (
  <div className="navigation">
    <button 
      onClick={onPrev} 
      disabled={isFirstPage}
    >
      <i className="fas fa-arrow-left"></i> {/* Left arrow for Previous */}
    </button>
    
    <button 
      onClick={onNext} 
      disabled={isLastPage}
    >
      <i className="fas fa-arrow-right"></i> {/* Right arrow for Next */}
    </button>
  </div>
);

export default Navigation;