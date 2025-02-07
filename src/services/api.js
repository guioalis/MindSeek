const API_BASE_URL = 'http://137.184.222.20:8888';

export const chatAPI = {
  sendMessage: async (messages, onChunk) => {
    try {
      // 只发送最后一条消息
      const lastMessage = messages[messages.length - 1];
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Connection': 'keep-alive'
        },
        body: JSON.stringify({
          model: 'deepseek-r1:32b-qwen-distill-q4_K_M',
          messages: [{
            role: lastMessage.role,
            content: lastMessage.content
          }],
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

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
              console.log(`总耗时: ${data.total_duration / 1000000}ms`);
              console.log(`评估次数: ${data.eval_count}`);
              return { text: accumulatedContent };
            }
          } catch (e) {
            console.warn('Failed to parse chunk:', e);
          }
        }
      }

      return { text: accumulatedContent };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}; 