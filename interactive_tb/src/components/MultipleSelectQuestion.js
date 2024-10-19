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

const MultipleSelectQuestion = ({ question, response, onResponseChange }) => {
  const handleChange = (optionId) => {
    const currentResponses = response || [];
    const isSelected = currentResponses.includes(optionId);
    const newResponses = isSelected
      ? currentResponses.filter((id) => id !== optionId)
      : [...currentResponses, optionId];

    onResponseChange(question.id, newResponses);
  };

  return (
    <div className="question multiple-select">
      <p>
        <strong>{renderContent(question.prompt)}</strong>
      </p>
      {question.options.map((option) => (
        <div key={option.id}>
          <label>
            <input
              type="checkbox"
              name={`question-${question.id}`}
              value={option.id}
              checked={response.includes(option.id)}
              onChange={() => handleChange(option.id)}
            />
            {/* Wrap option text with InlineMath */}
            {renderContent(option.text)}
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultipleSelectQuestion;
