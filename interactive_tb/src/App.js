import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';
import Home from './components/Home';  // Import the Home component
import IntermediatePage from './components/IntermediatePage';  // Import the Intermediate Page
import './App.css';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('summary');
  const [currentTopic, setCurrentTopic] = useState(0);

  const chapters = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"];
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

  // Use location to determine the current path
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/intermediate"; // Check if the current path is "/"

  return (
    <div className="app">
      {!isHomePage && ( // Conditionally render Sidebar and RightPanel only if not on the home page
        <>
          <Sidebar
            chapters={chapters}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            currentTopic={currentTopic}
            setCurrentTopic={setCurrentTopic}
          />
        </>
      )}
      
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Intermediate page route */}
        <Route path="/intermediate" element={<IntermediatePage />} />

        {/* Route for chapter and section */}
        <Route path="/chapter/:chapterId/section/:sectionId" element={
          <MainContent
            chapter={chapters[currentTopic]}
            pageType={currentPage}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        } />
      </Routes>
      {!isHomePage && ( // Conditionally render Sidebar and RightPanel only if not on the home page
        <>
          <RightPanel />
        </>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
