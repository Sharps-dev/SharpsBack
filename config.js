const baseConfig = {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET
};
const configs = {
    development: {
        ...baseConfig,
        url: process.env.LOCAL_URL,
        dbUrl: process.env.LOCAL_DB
    },
    production: {
        ...baseConfig,
        url: process.env.PUBLIC_URL,
        dbUrl: process.env.PUBLIC_DB
    },
    test: {
        ...baseConfig,
        url: process.env.LOCAL_URL,
        dbUrl: process.env.TEST_DB
    },
}

module.exports = configs[process.env.NODE_ENV];
