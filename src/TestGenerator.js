// src/components/TestGenerator.js
import React, { useState } from 'react';
import shuffle from 'lodash/shuffle';
import { saveAs } from 'file-saver';
import "./TestGenerator.css";

const TestGenerator = () => {
  const [questions, setQuestions] = useState([]);
  const [fileInput, setFileInput] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);

    // Assuming the file is a JSON file containing an array of questions
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsedQuestions = JSON.parse(e.target.result);
      setQuestions(parsedQuestions);
    };
    reader.readAsText(file);
  };

//   const shuffleQuestions = () => {
//     if (!questions.length) {
//       alert('Please upload a valid test file.');
//       return;
//     }

//     // Logic for shuffling questions
//     const shuffledQuestions = shuffle(questions);

//     // Logic for shuffling answers inside each question
//     const shuffledTest = shuffledQuestions.map((question) => ({
//       ...question,
//       answers: shuffle(question.answers),
//     }));

//     // Logic for generating and downloading multiple test files
//     for (let i = 0; i < 4; i++) {
//       const blob = new Blob([JSON.stringify(shuffledTest)], { type: 'application/json' });
//       saveAs(blob, `test_file_${i + 1}.json`);
//     }
//   };

const shuffleQuestions = () => {
    if (!questions.length) {
      alert('Please upload a valid test file.');
      return;
    }
  
    // Logic for generating and downloading multiple text files
    for (let i = 0; i < 4; i++) {
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
  
  

  return (
    <div className='test-generator'>
      <h1 className='title'>Multiple Choice Test Generator</h1>
      <input type="file" onChange={handleFileChange} accept=".json" />
      <button onClick={shuffleQuestions}>Generate Test Files</button>
    </div>
  );
};

export default TestGenerator;
