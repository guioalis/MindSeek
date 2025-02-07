import React, { useState } from 'react';
import './ChatInterface.css';
import { useChat } from '../context/ChatContext';
import { chatAPI } from '../services/api';
import MessageList from './Chat/MessageList';
import Button from './Common/Button';
import Loading from './Common/Loading';

function ChatInterface() {
  const { state, dispatch } = useChat();
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    // 添加用户消息到状态
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setInput('');
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await chatAPI.sendMessage([...state.messages, userMessage]);
      
      // 检查响应格式并添加AI回复
      if (response && response.choices && response.choices[0]) {
        const aiMessage = {
          role: 'assistant',
          content: response.choices[0].message.content,
          timestamp: Date.now()
        };
        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      } else if (response && response.message) {
        // 处理不同的API响应格式
        const aiMessage = {
          role: 'assistant',
          content: response.message.content,
          timestamp: Date.now()
        };
        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Chat Error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to get response from AI. Please try again.' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="chat-interface">
      <MessageList messages={state.messages} />
      {state.loading && <Loading />}
      {state.error && (
        <div className="error-message">
          {state.error}
        </div>
      )}
      <form onSubmit={sendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={state.loading}
        />
        <Button 
          type="submit" 
          disabled={state.loading || !input.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  );
}

export default ChatInterface; 