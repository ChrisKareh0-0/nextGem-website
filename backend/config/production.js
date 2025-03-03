export const config = {
  mongoUri: process.env.MONGODB_URI,
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'production'
}; 