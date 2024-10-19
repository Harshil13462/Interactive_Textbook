import React, { useEffect, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Navigation from './Navigation';
import Quiz from './Quiz';

const MainContent = ({ chapter, pageType, onNext, onPrev, isFirstPage, isLastPage }) => {
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!chapter || !pageType) {
          console.error('Invalid chapter or page type');
          return;
        }

        if (pageType === 'quiz') {
          // Fetch quiz questions
          const response = await fetch(
            `http://127.0.0.1:5000/api/quiz?chapter=${encodeURIComponent(chapter)}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setQuestions(data.questions);
        } else {
          // Fetch page content
          const response = await fetch(
            `http://127.0.0.1:5000/api/page?chapter=${encodeURIComponent(
              chapter
            )}&type=${encodeURIComponent(pageType)}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setContent(data.content);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [chapter, pageType]);

  // Capitalize page type for display
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Render content with LaTeX support
  const renderContent = (content) => {
    // Split content into parts that are either LaTeX expressions or plain text
    const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/g); // Split by LaTeX delimiters
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block LaTeX
        const math = part.slice(2, -2);
        return <BlockMath key={index} math={math} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline LaTeX
        const math = part.slice(1, -1);
        return <InlineMath key={index} math={math} />;
      } else {
        // Regular text
        return <span key={index}>{part}</span>;
      }
    });
  };

  // Determine previous and next page names for navigation
  const pageOrder = ['summary', 'activity', 'quiz'];
  const currentPageIndex = pageOrder.indexOf(pageType);
  const isFirstPageType = currentPageIndex === 0;
  const isLastPageType = currentPageIndex === pageOrder.length - 1;

  const prevPageName = !isFirstPageType ? capitalize(pageOrder[currentPageIndex - 1]) : '';
  const nextPageName = !isLastPageType ? capitalize(pageOrder[currentPageIndex + 1]) : '';

  return (
    <div className="main-content">
      <h2>
        {chapter} - {capitalize(pageType)}
      </h2>

      {pageType === 'quiz' ? (
        questions.length > 0 ? (
          <Quiz questions={questions} />
        ) : (
          <p>Loading quiz...</p>
        )
      ) : (
        <div className="content">{renderContent(content)}</div>
      )}

      <Navigation
        onNext={onNext}
        onPrev={onPrev}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        prevPageName={prevPageName}
        nextPageName={nextPageName}
      />
    </div>
  );
};

export default MainContent;
