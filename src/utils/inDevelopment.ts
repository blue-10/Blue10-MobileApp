export const inDevelopment = () => {
  const env = process.env.NODE_ENV;
  return env === 'development';
};
