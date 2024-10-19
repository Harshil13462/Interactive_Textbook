import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('summary');
  const [currentTopic, setCurrentTopic] = useState(0);

  const chapters = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 3", "Chapter 3"];

  const pageOrder = ['summary', 'activity', 'quiz'];
  const currentPageIndex = pageOrder.indexOf(currentPage);
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === pageOrder.length - 1;

  const handleNext = () => {
    if (!isLastPage) {
      setCurrentPage(pageOrder[currentPageIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!isFirstPage) {
      setCurrentPage(pageOrder[currentPageIndex - 1]);
    }
  };

  return (
    <div className="app">
      <Sidebar
        chapters={chapters}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentTopic={currentTopic}
        setCurrentTopic={setCurrentTopic}
      />
      <MainContent
        chapter={chapters[currentTopic]}
        pageType={currentPage}
        onNext={handleNext}
        onPrev={handlePrev}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
      <RightPanel />
    </div>
  );
};

export default App;
