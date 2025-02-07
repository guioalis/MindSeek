import React from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import { ChatProvider } from './context/ChatContext';
import './styles/global.css';

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <Header />
        <ChatInterface />
      </div>
    </ChatProvider>
  );
}

export default App; 