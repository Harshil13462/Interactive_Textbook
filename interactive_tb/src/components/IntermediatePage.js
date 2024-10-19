import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntermediatePage.css'; // Import the CSS file for styling

const IntermediatePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call the Flask API to start the processing
    const callFlaskFunction = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/process_pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to process PDF');
        }

        const data = await response.json();
        console.log('Response from backend:', data);

        // Redirect to the next page based on the response
        navigate(data.next_page);
      } catch (error) {
        console.error('Error during processing:', error);
        // Optionally handle the error (e.g., display an error message)
      }
    };

    callFlaskFunction(); // Call the Flask function when the component loads
  }, [navigate]);

  return (
    <div className="intermediate-container">
      <h1>Processing your file...</h1>
      <p>Please wait while we process your PDF.</p>
      <div className="spinner"></div> {/* Optionally add a spinner */}
    </div>
  );
};

export default IntermediatePage;
