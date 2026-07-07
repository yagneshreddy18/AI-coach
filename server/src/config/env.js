import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/placementpilot',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_me',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default env;
