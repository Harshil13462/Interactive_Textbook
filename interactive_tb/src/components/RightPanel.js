import React, { useState } from 'react';

const RightPanel = () => {
  const [chatInput, setChatInput] = useState(""); // For storing input value
  const [chatHistory, setChatHistory] = useState([]); // For storing chat history

  // Handle submitting a new chat message
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return; // Don't submit empty input

    // Placeholder response (for now) until backend is integrated
    const response = "This is a placeholder response. The backend will be integrated soon.";

    // Update chat history
    setChatHistory([
      ...chatHistory,
      { type: "user", message: chatInput },
      { type: "bot", message: response }
    ]);

    // Clear input field
    setChatInput("");
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
