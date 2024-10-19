import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('summary'); // 'summary', 'activity', 'quiz'
  const [currentTopic, setCurrentTopic] = useState(0); // Topic index

  const chapters = ["Chapter 1", "Chapter 2", "Chapter 3"]; // Example chapters

  const isFirstPage = currentPage === 'summary';
  const isLastPage = currentPage === 'quiz';

  const handleNext = () => {
    if (currentPage === 'summary') setCurrentPage('activity');
    else if (currentPage === 'activity') setCurrentPage('quiz');
  };

  const handlePrev = () => {
    if (currentPage === 'activity') setCurrentPage('summary');
    else if (currentPage === 'quiz') setCurrentPage('activity');
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
        topic={chapters[currentTopic]} 
        currentPage={currentPage}
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