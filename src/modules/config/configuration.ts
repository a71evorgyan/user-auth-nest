export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  HOST: process.env.HOST || '127.0.0.1',
  MONGODB_URI: `${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}`,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: '1d',
  },
});
