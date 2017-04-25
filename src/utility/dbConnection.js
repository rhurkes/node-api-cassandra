const cassandra = require('cassandra-driver');
const config = require('../config');

/**
 * This client is designed to be long-lived, so we can keep it around for the life of the module.
 */
const client = new cassandra.Client({
  contactPoints: [config.dbHost],
  keyspace: config.dbKeyspace,
});

module.exports = client;
