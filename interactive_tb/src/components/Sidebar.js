import React from 'react';

const Sidebar = ({ chapters, setCurrentTopic, setCurrentPage, currentTopic }) => (
  <div className="sidebar">
    <ul>
      {chapters.map((chapter, index) => (
        <li 
          key={index} 
          onClick={() => setCurrentTopic(index)} 
          className={currentTopic === index ? 'active' : ''}
        >
          {chapter}
        </li>
      ))}
    </ul>

    <div className="page-links">
      <ul>
        <li onClick={() => setCurrentPage('summary')}>Summary</li>
        <li onClick={() => setCurrentPage('activity')}>Activity</li>
        <li onClick={() => setCurrentPage('quiz')}>Quiz</li>
      </ul>
    </div>
  </div>
);

export default Sidebar;
