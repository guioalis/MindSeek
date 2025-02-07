import React from 'react';
import PropTypes from 'prop-types';

function Message({ content, role, timestamp }) {
  return (
    <div className={`message ${role}`}>
      <div className="message-content">{content}</div>
      <div className="message-timestamp">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

Message.propTypes = {
  content: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['user', 'assistant']).isRequired,
  timestamp: PropTypes.number
};

export default Message; 