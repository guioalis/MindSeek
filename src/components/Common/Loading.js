import React from 'react';
import './Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-dots">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>AI is thinking...</p>
    </div>
  );
}

export default Loading; 