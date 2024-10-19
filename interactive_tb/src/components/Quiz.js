import React, { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import MultipleSelectQuestion from './MultipleSelectQuestion';
import FreeResponseQuestion from './FreeResponseQuestion';
import './Quiz.css';

const Quiz = ({ questions }) => {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState([]); // State to store feedback

  const handleResponseChange = (questionId, response) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: response,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send the responses to the backend for feedback
      const response = await fetch('http://127.0.0.1:5000/api/submit_quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }
      
      const data = await response.json();
      setFeedback(data.feedback); // Store the feedback received from the backend
      setSubmitted(true); // Disable the form after submission
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const renderFeedback = (questionId) => {
    const feedbackForQuestion = feedback.find(fb => fb.question_id === questionId);
    if (feedbackForQuestion) {
      return (
        <div className="feedback">
          {feedbackForQuestion.correct ? (
            <p style={{ color: 'green' }}>Correct!</p>
          ) : (
            <p style={{ color: 'red' }}>Incorrect.</p>
          )}
          <p style={{ color: 'blue' }}>{feedbackForQuestion.message}</p>
          <br></br>
        </div>
      );
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question) => {
        return (
          <div key={question.id}>
            {question.type === 'multiple_choice' && (
              <MultipleChoiceQuestion
                question={question}
                response={responses[question.id]}
                onResponseChange={handleResponseChange}
              />
            )}
            {question.type === 'multiple_select' && (
              <MultipleSelectQuestion
                question={question}
                response={responses[question.id] || []}
                onResponseChange={handleResponseChange}
              />
            )}
            {question.type === 'free_response' && (
              <FreeResponseQuestion
                question={question}
                response={responses[question.id] || ''}
                onResponseChange={handleResponseChange}
              />
            )}
            {/* Render feedback below each question */}
            {submitted && renderFeedback(question.id)}
          </div>
        );
      })}
      <br></br>
      <div className="submit-container">
      <button
        type="submit"
        className="submit-button"
      >
        {submitted ? 'Resubmit' : 'Submit Quiz'}
      </button>
      </div>
    </form>
  );
};

export default Quiz;
