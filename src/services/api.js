import config from '../config';

export const chatAPI = {
  sendMessage: async (messages, onChunk) => {
    try {
      const lastMessage = messages[messages.length - 1];
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);

      const response = await fetch(`${config.API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Connection': 'keep-alive'
        },
        body: JSON.stringify({
          model: config.MODEL,
          messages: [{
            role: lastMessage.role,
            content: lastMessage.content
          }],
          stream: true
        }),
        signal: controller.signal,
        keepalive: true,
        timeout: config.CONNECT_TIMEOUT
      });

      clearTimeout(timeoutId);

      if (!response.ok || !response.body) {
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const data = JSON.parse(line);
              
              if (data.message?.content) {
                accumulatedContent += data.message.content;
                onChunk(data.message.content);
              }
              
              if (data.done) {
                const totalDuration = data.total_duration ? 
                  `${Math.round(data.total_duration/1000000)}ms` : 'N/A';
                const evalCount = data.eval_count || 'N/A';
                
                return { 
                  text: accumulatedContent,
                  metrics: {
                    duration: totalDuration,
                    evalCount: evalCount
                  }
                };
              }
            } catch (e) {
              console.warn('Failed to parse chunk:', e);
            }
          }
        }
      } catch (error) {
        reader.cancel();
      }

      return { text: accumulatedContent };
    } catch (error) {
      console.error('API Error:', error);
    }
  }
}; 