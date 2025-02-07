const API_BASE_URL = 'http://137.184.222.20:8888';

export const chatAPI = {
  sendMessage: async (messages) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1:32b-qwen-distill-q4_K_M',
          messages: messages.map(({ role, content }) => ({ role, content }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Network response was not ok');
      }

      const data = await response.json();
      
      // 验证响应数据
      if (!data || (!data.choices && !data.message)) {
        throw new Error('Invalid response format from API');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}; 