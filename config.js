module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  dbUrl: process.env.NODE_ENV == "dev" ? process.env.LOCAL_DB : process.env.PUBLIC_DB,
  url: process.env.NODE_ENV == "dev" ? process.env.LOCAL_URL : process.env.PUBLIC_URL,
  jwtSecret: process.env.jwt,
};
