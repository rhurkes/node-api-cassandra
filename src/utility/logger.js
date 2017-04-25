const bunyan = require('bunyan');

const logger = bunyan.createLogger({ name: 'node-api-cassandra' });

module.exports = logger;
