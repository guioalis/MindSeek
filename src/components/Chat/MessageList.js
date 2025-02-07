import React from 'react';
import Message from './Message';
import PropTypes from 'prop-types';

function MessageList({ messages }) {
  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <Message
          key={index}
          content={message.content}
          role={message.role}
          timestamp={message.timestamp || Date.now()}
        />
      ))}
    </div>
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      timestamp: PropTypes.number
    })
  ).isRequired
};

export default MessageList; 