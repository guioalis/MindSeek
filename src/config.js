const config = {
  development: {
    API_BASE_URL: 'http://137.184.222.20:8888',
    MODEL: 'deepseek-r1:32b-qwen-distill-q4_K_M',
    TIMEOUT: 60000,
    CONNECT_TIMEOUT: 10000
  },
  production: {
    API_BASE_URL: 'http://137.184.222.20:8888',
    MODEL: 'deepseek-r1:32b-qwen-distill-q4_K_M',
    TIMEOUT: 60000,
    CONNECT_TIMEOUT: 10000
  }
};

const env = process.env.NODE_ENV || 'development';
export default config[env]; 