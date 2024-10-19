import React, { useState } from 'react';

import "./Sidebar.css"

const Sidebar = ({ chapters, setCurrentTopic, setCurrentPage, currentTopic, currentPage }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      // Send the file to the backend
      const response = await fetch('http://127.0.0.1:5000/api/upload_pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        throw new Error("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="sidebar">
      {/* PDF Upload Form */}
      <div className="file-upload">
        <h4>Upload PDF</h4>
        <form onSubmit={handleFileUpload}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
      <ul>
        {chapters.map((chapter, index) => (
          <li 
            key={index} 
            onClick={() => {
              setCurrentTopic(index);
              setCurrentPage('summary'); // Reset to 'summary' when a new chapter is selected
            }} 
            className={currentTopic === index ? 'active' : ''}
          >
            {chapter}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;