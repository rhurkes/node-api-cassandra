const request = require('request-promise-native');
const config = require('../config');
const logger = require('../utility/logger');

/**
 * Built-up querystring parameter value that tells the API to ignore all fields
 * except the one we need: item
 */
const excludedProperties = [
  'taxonomy', 'price', 'promotion', 'bulk_ship', 'rating_and_review_reviews',
  'rating_and_review_statistics', 'question_answer_statistics', 'deep_red_labels',
  'available_to_promise_network',
].join(',');

const fetchProductOptions = {
  qs: { excludes: excludedProperties },
  headers: { 'User-Agent': 'node-api-cassandra' },
  json: true,
};

/**
 * Fetches a product from the Redsky service.
 * @param {number} productID
 * @returns {promise} Promisified Redsky response
 */
function fetchProduct(productID) {
  const options = Object.assign({}, fetchProductOptions, {
    url: `${config.redskyBaseURL}/${productID}`,
  });

  return request.get(options)
    .catch((err) => {
      logger.warn('fetchProducts', err);
    });
}

module.exports = {
  fetchProduct,
};
