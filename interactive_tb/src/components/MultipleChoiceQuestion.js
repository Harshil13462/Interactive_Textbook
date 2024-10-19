import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Ensure this is imported

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

const MultipleChoiceQuestion = ({ question, response, onResponseChange }) => {
  const handleChange = (e) => {
    onResponseChange(question.id, e.target.value);
  };

  return (
    <div className="question multiple-choice">
      <p>
        {/* Use BlockMath to render the prompt */}

        <strong>{renderContent(question.prompt)}</strong>
      </p>
      {question.options.map((option) => (
        <div key={option.id}>
          <label>
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={response === option.id}
              onChange={handleChange}
            />
            {/* Use InlineMath to render option text */}
            {renderContent(option.text)}
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoiceQuestion;
