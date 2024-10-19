import React, { useState } from 'react';

const RightPanel = () => {
  const [chatInput, setChatInput] = useState("");  // Input value from user
  const [chatHistory, setChatHistory] = useState([]);  // Chat history

  // Handle chat submit
  const handleChatSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if input is empty
    if (!chatInput.trim()) return;

    // Add user's message to the chat history
    setChatHistory([...chatHistory, { type: 'user', message: chatInput }]);

    try {
      // Make POST request to Flask backend
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: chatInput }),
      });

      if (!response.ok) {
        throw new Error('Error in API call');
      }

      // Parse JSON response
      const data = await response.json();

      // Add bot's response to the chat history
      setChatHistory([...chatHistory, { type: 'user', message: chatInput }, { type: 'bot', message: data.message }]);

    } catch (error) {
      console.error('Error fetching chat response:', error);
    }

    // Clear input field
    setChatInput('');
  };

  return (
    <div className="right-panel">
      <h3>Chat with GPT</h3>

      <div className="chat-history">
        {chatHistory.map((entry, index) => (
          <div key={index} className={`chat-message ${entry.type}`}>
            {entry.message}
          </div>
        ))}
      </div>

      <form onSubmit={handleChatSubmit} className="chat-input-form">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default RightPanel;
