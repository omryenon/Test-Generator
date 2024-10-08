// src/components/TestGenerator.js
import React, { useState } from 'react';
import shuffle from 'lodash/shuffle';
import { saveAs } from 'file-saver';
import "./TestGenerator.css";

const TestGenerator = () => {
  const [fileInput, setFileInput] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [columns, setColumns] = useState(null);

  const downloadExample = () => {
    // Define the path to your JSON file
    const filePath = `${process.env.PUBLIC_URL}/test-examples/example.json`;
    
    // Fetch the file and trigger download
    fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then((blob) => {
        saveAs(blob, 'example.json'); // Use FileSaver.js to save the file
      })
      .catch((error) => {
        console.error('There was an error downloading the file:', error);
      });
  };

  const displayErrorMessage = (message) => {
    setErrorMessage(message);
    
    // Remove the error message after 5 seconds
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Validate file type
    if (file && file.type !== 'application/json' && !file.name.endsWith('.json')) {
      displayErrorMessage('Invalid file type. Please upload a JSON file');
      return;
    }

    setFileInput(file);
    setErrorMessage('');

    // Assuming the file is a JSON file containing an array of questions
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsedQuestions = JSON.parse(e.target.result);
      setQuestions(parsedQuestions);
    };
    reader.readAsText(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    // Validate dropped file type
    if (droppedFile && droppedFile.type !== 'application/json' && !droppedFile.name.endsWith('.json')) {
      displayErrorMessage('Invalid file type. Please upload a JSON file');
      return;
    }
    handleFileChange({ target: { files: [droppedFile] } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const shuffleQuestions = () => {
    if (!questions.length) {
      displayErrorMessage('Please upload a valid test file');
      return;
    }

    if (!columns) {
      displayErrorMessage('Please provide columns');
      return;
    }
  
    // Logic for generating and downloading multiple text files
    for (let i = 0; i < columns; i++) {
      // Shuffle questions for each file
      const shuffledQuestions = shuffle([...questions]);
  
      // Shuffle answers inside each question
      const shuffledTest = shuffledQuestions.map((question) => ({
        ...question,
        answers: shuffle(question.answers),
      }));
  
      const fileContent = shuffledTest.map((question, index) => {
        const answerIndex = question.answers.indexOf(question.answers[index]);
        return `${index + 1}. ${question.prompt}\n  A. ${question.answers[0]}\n  B. ${question.answers[1]}\n  C. ${question.answers[2]}\n  D. ${question.answers[3]}`;
      }).join('\n\n');
  
      const blob = new Blob([fileContent], { type: 'text/plain' });
      saveAs(blob, `test_file_${i + 1}.txt`);
    }
  };

  const handleRemoveFile = () => {
    setFileInput(null);
    setQuestions([]);
    setErrorMessage('');
  };

  const handleColumnsChange = (event) => {
    
    if(!event.target.value) {
      setColumns(null);
      return;
    }

    const value = parseInt(event.target.value, 10);

    // Ensure the number is between 2 and 9
    if (value >= 2 && value <= 20) {
      setColumns(value);
    } else {
      displayErrorMessage('Columns must be between 2 and 20');
    }
  };
  
  

  return (
    <div className='test-generator'>
      <div className='title'>Multiple Choice Test Generator</div>
      {/* <input type="file" onChange={handleFileChange} accept=".json" /> */}

      <div 
        className={`drop-zone ${dragging ? 'dragging' : ''}`} 
        onDrop={handleDrop} 
        onDragOver={handleDragOver} 
        onDragLeave={handleDragLeave}
      >
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".json" 
          style={{ display: 'none' }} 
          id="fileInput"
        />
        <label htmlFor="fileInput" className="file-label">
          {fileInput ? fileInput.name :
          dragging? `Drop it like it's hot` :
           'Drop a file here or click to upload'}
        </label>
        {fileInput && (
          <button className="remove-file-button" onClick={handleRemoveFile}>
            &times;
          </button>
        )}
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="columns-input">
        <label htmlFor="columns" className='columns'>Columns:</label>
        <input
          type="number"
          id="columns"
          value={columns}
          onChange={handleColumnsChange}
          min="2"
          max="20"
        />
      </div>

      <button className="download-example-button" onClick={downloadExample}>
        <div className='download-example-text'>Download Example</div>
      </button>

      <button onClick={shuffleQuestions} className='generate-button'>Generate Test Files</button>
    </div>
  );
};

export default TestGenerator;
