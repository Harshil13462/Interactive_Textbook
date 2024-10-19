import React, { useEffect, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { useParams } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import Navigation from './Navigation';
import Quiz from './Quiz';

const MainContent = ({ onNext, onPrev, isFirstPage, isLastPage }) => {
  const { chapterId, sectionId } = useParams();  // Get chapterId and sectionId from the URL
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState([]);
  const [treeData, setTreeData] = useState(null); // Store tree structure data
  const [pageType, setPageType] = useState('summary'); // Default page type to 'summary'

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!chapterId || !sectionId) {
          console.error('Invalid chapter or section ID');
          return;
        }

        if (pageType === 'quiz') {
          // Fetch quiz questions
          const response = await fetch(
            `http://127.0.0.1:5000/api/quiz?chapter=${encodeURIComponent(chapterId)}&section=${encodeURIComponent(sectionId)}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setQuestions(data.questions);
        } else if (pageType === 'summary') {
          // Fetch tree structure for summary section
          const response = await fetch('http://127.0.0.1:5000/api/tree');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setTreeData(data);
        } else {
          // Fetch page content
          const response = await fetch(
            `http://127.0.0.1:5000/api/page?chapter=${encodeURIComponent(chapterId)}&section=${encodeURIComponent(
              sectionId
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
  }, [chapterId, sectionId, pageType]);  // Re-run fetch whenever chapter, section, or page type changes

  // Capitalize page type for display
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Render content with LaTeX support
  const renderContent = (content) => {
    const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/g);  // Split by LaTeX delimiters
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2);
        return <BlockMath key={index} math={math} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        return <InlineMath key={index} math={math} />;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  // Function to find the relevant section in the tree structure
  const findTreeNode = (chapterId, sectionId, node) => {
    if (node.name === `Chapter ${chapterId}`) {
      return node.children.find(child => child.name === `Section ${sectionId}`);
    }
    return node.children.map(child => findTreeNode(chapterId, sectionId, child)).find(Boolean);
  };

  // Render the summary content (tree structure) for the current chapter and section
  const renderSummary = () => {
    if (!treeData) return <p>Loading summary...</p>;

    const relevantNode = findTreeNode(parseInt(chapterId), parseInt(sectionId), treeData);
    return relevantNode ? (
      <div>
        <h3>{relevantNode.name}</h3>
        <p>{relevantNode.content}</p>
      </div>
    ) : (
      <p>No summary found for this section.</p>
    );
  };

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
          {pageType === 'summary' ? renderSummary() : renderContent(content)}
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
