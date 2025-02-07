import React, { useState, useRef } from 'react';
import './ChatInterface.css';
import { useChat } from '../context/ChatContext';
import { chatAPI } from '../services/api';
import MessageList from './Chat/MessageList';
import Button from './Common/Button';
import Loading from './Common/Loading';

function ChatInterface() {
  const { state, dispatch } = useChat();
  const [input, setInput] = useState('');
  const currentMessageRef = useRef(null);
  const [metrics, setMetrics] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setInput('');
    dispatch({ type: 'SET_LOADING', payload: true });
    setMetrics(null);

    try {
      const aiMessage = {
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      currentMessageRef.current = aiMessage;

      const result = await chatAPI.sendMessage([...state.messages, userMessage], (chunk) => {
        currentMessageRef.current = {
          ...currentMessageRef.current,
          content: currentMessageRef.current.content + chunk
        };
        
        dispatch({ 
          type: 'UPDATE_LAST_MESSAGE', 
          payload: currentMessageRef.current 
        });
      });

      if (result.metrics) {
        setMetrics(result.metrics);
      }

    } catch (error) {
      console.error('Chat Error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      currentMessageRef.current = null;
    }
  };

  return (
    <div className="chat-interface">
      <MessageList messages={state.messages} />
      {state.loading && <Loading />}
      {metrics && (
        <div className="metrics">
          <span>耗时: {metrics.duration}</span>
          <span>评估次数: {metrics.evalCount}</span>
        </div>
      )}
      <form onSubmit={sendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入您的消息..."
          disabled={state.loading}
        />
        <Button 
          type="submit" 
          disabled={state.loading || !input.trim()}
        >
          发送
        </Button>
      </form>
    </div>
  );
}

export default ChatInterface; 