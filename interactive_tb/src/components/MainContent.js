import React from 'react';

const MainContent = ({ topic, currentPage, onNext, onPrev, isFirstPage, isLastPage }) => {
  return (
    <div className="main-content">
      {/* Display the current topic (chapter) at the top */}
      <h2>{topic}</h2>

      {/* Main content changes depending on currentPage */}
      <div className="content-body">
        {currentPage === 'summary' && <p>Summary for {topic}</p>}
        {currentPage === 'activity' && <p>Activity for {topic}</p>}
        {currentPage === 'quiz' && <p>Quiz for {topic}</p>}
      </div>

      {/* Navigation Buttons (inside Main Content) */}
      <div className="navigation">
        <button onClick={onPrev} disabled={isFirstPage} className="nav-btn">
          ←
        </button>
        <button onClick={onNext} disabled={isLastPage} className="nav-btn">
          →
        </button>
      </div>
    </div>
  );
};

export default MainContent;
