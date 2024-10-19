import React, { useState } from 'react';

const RightPanel = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
  
    if (!chatInput.trim()) return;
  
    setChatHistory(prevHistory => [...prevHistory, { type: 'user', message: chatInput }]);
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: chatInput }),
      });
  
      if (!response.ok) {
        throw new Error(`Error in API call: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      setChatHistory(prevHistory => [
        ...prevHistory,
        { type: 'bot', message: data.message },
      ]);
  
    } catch (error) {
      console.error('Error fetching chat response:', error);
  
      setChatHistory(prevHistory => [
        ...prevHistory,
        { type: 'bot', message: 'Sorry, something went wrong.' },
      ]);
    }
  
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
