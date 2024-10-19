import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';

const renderContent = (text) => {
    // Split the string into text and LaTeX parts
    const parts = text.split(/(\$[^$]*\$)/g); // Split by $...$ for inline LaTeX
  
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        // It's LaTeX, render using InlineMath
        const math = part.slice(1, -1); // Remove the $ symbols
        return <InlineMath key={index} math={math} />;
      } else {
        // It's regular text, render as <span>
        return <span key={index}>{part}</span>;
      }
    });
  };

const FreeResponseQuestion = ({ question, response, onResponseChange }) => {
  const handleChange = (e) => {
    onResponseChange(question.id, e.target.value);
  };

  return (
    <div className="question free-response">
      <p>
        {/* Wrap the prompt with BlockMath */}
        <strong>{renderContent(question.prompt)}</strong>
      </p>
      <textarea
        name={`question-${question.id}`}
        value={response}
        onChange={handleChange}
        rows="4"
        cols="50"
      />
    </div>
  );
};

export default FreeResponseQuestion;
