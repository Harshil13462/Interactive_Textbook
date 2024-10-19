import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';  // Import the new CSS file for styling

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();  // For navigation after file upload

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
      const response = await fetch('http://127.0.0.1:5000/api/upload_pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Redirect to the intermediate page after the file is uploaded
        navigate('/intermediate');
      } else {
        throw new Error("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome! Upload a PDF to Get Started</h1>
        <p className="home-description">Please upload your PDF file below to begin. Once uploaded, you'll be taken to an intermediate page while we process the file.</p>
        <form className="home-form" onSubmit={handleFileUpload}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="home-file-input"
          />
          <button type="submit" className="home-upload-button">Upload PDF</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
