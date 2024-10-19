import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Use useNavigate and useLocation for navigation
import "./Sidebar.css";

const Sidebar = ({ setCurrentTopic, setCurrentPage, currentTopic, currentPage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [contents, setContents] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation(); // Get the current location
  const [expandedChapter, setExpandedChapter] = useState(parseInt(location.pathname.split('/')[2]) - 1); // Track which chapter is expanded
  const navigate = useNavigate(); // Use navigate for navigation

  // Automatically fetch the JSON from the backend when the component mounts
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/get_json');
        if (!response.ok) {
          throw new Error('Failed to fetch contents');
        }

        const data = await response.json();
        setContents(data.Contents || []); // Set contents from the response
      } catch (error) {
        console.error('Error fetching contents:', error);
        setError('Error fetching contents. Please try again.');
      }
    };

    fetchContents(); // Trigger the fetch when the component mounts
    console.log(contents)
  }, []); // Empty dependency array means this runs once on component mount

  // Handle chapter click to expand/collapse subsections
  const handleChapterClick = (chapterIndex) => {
    if (expandedChapter === chapterIndex) {
      setExpandedChapter(null); // Collapse chapter if already expanded
    } else {
      setExpandedChapter(chapterIndex); // Expand the clicked chapter
    }
  };

  // Handle subsection click and navigate to the appropriate route
  const handleSubsectionClick = (chapterIndex, sectionIndex) => {
    setCurrentTopic(chapterIndex);
    setCurrentPage('summary'); // Reset page to 'summary' on subsection click
    navigate(`/chapter/${chapterIndex + 1}/section/${sectionIndex + 1}`); // Navigate to the subsection page
  };

  // Determine the current selected chapter and section from the URL
  const getSelectedSubsection = () => {
    const pathParts = location.pathname.split('/');
    const chapterId = parseInt(pathParts[2]) - 1; // Get chapter index from URL
    const sectionId = parseInt(pathParts[4]) - 1; // Get section index from URL
    return { chapterId, sectionId };
  };

  const selectedSubsection = getSelectedSubsection();

  return (
    <div className="sidebar">
      {/* Home Button */}
      <button className="home-button" onClick={() => navigate('/')}>
        Go to Home
      </button>

      {/* Error handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Render chapters and subsections */}
      {contents.length > 0 && (
        <ul>
          {contents.map((content, contentIndex) => (
            content.chapters && content.chapters.map((chapter, chapterIndex) => (
              <li key={chapterIndex}>
                {/* Chapter title clickable */}
                <div 
                  onClick={() => handleChapterClick(chapterIndex)}
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {chapter.title} (Page {chapter.page})
                </div>

                {/* Render subsections only if this chapter is expanded */}
                {expandedChapter === chapterIndex && (
                  <ul>
                    {chapter.sections.map((section, sectionIndex) => (
                      <li 
                        key={sectionIndex} 
                        onClick={() => handleSubsectionClick(chapterIndex, sectionIndex)} // Navigate to the subsection page
                        style={{
                          marginLeft: '20px',
                          cursor: 'pointer',
                          fontWeight: (selectedSubsection.chapterId === chapterIndex && selectedSubsection.sectionId === sectionIndex)
                            ? 'bold'
                            : 'normal',  // Set bold if selected
                        }}
                      >
                        {section.title} (Page {section.page})
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
