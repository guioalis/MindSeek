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

    try {
      // 创建一个初始的 AI 响应消息
      const aiMessage = {
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      currentMessageRef.current = aiMessage;

      // 处理流式响应
      await chatAPI.sendMessage([...state.messages, userMessage], (chunk) => {
        // 更新当前消息的内容
        currentMessageRef.current = {
          ...currentMessageRef.current,
          content: currentMessageRef.current.content + chunk
        };
        
        // 更新消息列表中的最后一条消息
        dispatch({ 
          type: 'UPDATE_LAST_MESSAGE', 
          payload: currentMessageRef.current 
        });
      });

    } catch (error) {
      console.error('Chat Error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: '无法获取 AI 响应，请重试。' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      currentMessageRef.current = null;
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