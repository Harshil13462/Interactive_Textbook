import React, { useEffect, useState } from 'react';

const MainContent = ({ chapter, pageType }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Check that chapter and pageType are valid before making the request
        if (!chapter || !pageType) {
          console.error('Invalid chapter or page type');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/page?chapter=${chapter}&type=${pageType}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching page content:', error);
      }
    };

    fetchContent();
  }, [chapter, pageType]);  // Make sure to re-fetch if chapter or pageType changes

  return (
    <div className="main-content">
      <h2>{chapter}</h2>
      <p>{content}</p>
    </div>
  );
};

export default MainContent;
