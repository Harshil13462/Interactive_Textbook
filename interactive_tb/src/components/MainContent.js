import React, { useEffect, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { useParams } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import Navigation from './Navigation';
import Quiz from './Quiz';

const renderContent = (content) => {
  // Step 1: Split the content by LaTeX delimiters, headings, and markdown syntax
  const parts = content.split(/(\\\(.+?\\\)|\\\[.+?\\\]|#.*|(\*\*.*?\*\*)|(\*.*?\*))/g);

  return parts.map((part, index) => {
    if (!part) return null; // Skip empty parts
    
    if (part.startsWith("\\(") && part.endsWith("\\)")) {
      // Inline LaTeX: \( ... \)
      const math = part.slice(2, -2); // Remove \( and \)
      return <InlineMath key={index} math={math} />;
    } else if (part.startsWith("\\[") && part.endsWith("\\]")) {
      // Block LaTeX: \[ ... \]
      const math = part.slice(2, -2); // Remove \[ and \]
      return <BlockMath key={index} math={math} />;
    } else if (part.startsWith("#")) {
      // Handle hashtags for headings
      const level = part.match(/#/g).length; // Count the number of '#'
      const headingText = part.replace(/#/g, '').trim(); // Remove the hashtags and trim
      return React.createElement(`h${Math.min(level, 6)}`, { key: index }, headingText);
    } else if (part.startsWith("**") && part.endsWith("**")) {
      // Bold text (with **)
      const boldText = part.slice(2, -2);
      return <strong key={index}>{boldText}</strong>;
    } else if (part.startsWith("*") && part.endsWith("*")) {
      // Italic text (with *)
      const italicText = part.slice(1, -1);
      return <em key={index}>{italicText}</em>;
    } else {
      // Regular text
      return <span key={index}>{part}</span>;
    }
  });
};



const MainContent = ({ onNext, onPrev, isFirstPage, isLastPage }) => {
  const { chapterId, sectionId } = useParams(); // Get chapterId and sectionId from the URL
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState([]);
  const [pageType, setPageType] = useState('summary'); // Default page type to 'summary'

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!chapterId || !pageType) {
          console.error('Invalid chapter or page type');
          return;
        }

        let response;
        if (pageType === 'quiz') {
          // Fetch quiz questions from a dedicated quiz endpoint
          response = await fetch(
            `http://127.0.0.1:5000/api/quiz?chapter=${encodeURIComponent(chapterId)}&section=${encodeURIComponent(sectionId)}`
          );
        } else {
          // Fetch content for summary or activity
          response = await fetch(
            `http://127.0.0.1:5000/api/page?chapter=${encodeURIComponent(chapterId)}&section=${encodeURIComponent(sectionId)}`
          );
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (pageType === 'quiz') {
          setQuestions(data.questions || []); // Set quiz questions if present
        } else {
          setContent(data.content || 'No content available'); // Set the content (summary or activity)
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent('Error loading content.'); // Display error message
      }
    };

    fetchContent();
  }, [chapterId, sectionId, pageType]); // Re-fetch when chapter, section, or pageType changes

  // Capitalize page type for display
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Render content with LaTeX support

  // Determine previous and next page names for navigation
  const pageOrder = ['summary', 'activity', 'quiz'];
  const currentPageIndex = pageOrder.indexOf(pageType);
  const isFirstPageType = currentPageIndex === 0;
  const isLastPageType = currentPageIndex === pageOrder.length - 1;

  const prevPageName = !isFirstPageType ? capitalize(pageOrder[currentPageIndex - 1]) : '';
  const nextPageName = !isLastPageType ? capitalize(pageOrder[currentPageIndex + 1]) : '';

  const handleNext = () => {
    if (!isLastPageType) {
      setPageType(pageOrder[currentPageIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!isFirstPageType) {
      setPageType(pageOrder[currentPageIndex - 1]);
    }
  };

  return (
    <div className="main-content">
      <h2>
        Chapter {chapterId} - Section {sectionId} - {capitalize(pageType)}
      </h2>

      {pageType === 'quiz' ? (
        questions.length > 0 ? (
          <Quiz questions={questions} />
        ) : (
          <p>Loading quiz...</p>
        )
      ) : (
        <div className="content">
          {content ? renderContent(content) : <p>Loading content...</p>}
        </div>
      )}

      <Navigation
        onNext={handleNext}
        onPrev={handlePrev}
        isFirstPage={isFirstPageType}
        isLastPage={isLastPageType}
        prevPageName={prevPageName}
        nextPageName={nextPageName}
      />
    </div>
  );
};

export default MainContent;
