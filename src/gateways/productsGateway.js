const logger = require('../utility/logger');
const dbConnection = require('../utility/dbConnection');

/**
 * Returns a product from the pricing database.
 * @param {number} productID
 * @returns {promise}
 */
function readProduct(productID) {
  const query = 'SELECT * FROM products WHERE product_id = ?';
  const params = [productID];

  return dbConnection.execute(query, params, { prepare: true })
    .then(result => result.first())
    .then((result) => {
      const price = parseFloat(result.price);
      const validPrice = !isNaN(price) && price >= 0;

      if (!validPrice) {
        logger.warn('readProduct', { id: productID, message: 'invalid price found' });
        return undefined;
      }

      return { price, currency_code: result.currency_code };
    })
    .catch((err) => {
      logger.warn(err);
    });
}

// Assumption: That we want to create a new product if no record found
/**
 * Updates an existing product, or create a new product, in the pricing database.
 * @param {number} productID
 * @param {number} price
 * @param {string} currencyCode Defaults to 'USD'
 * @returns {promise}
 */
function updateProductPrice(productID, price, currencyCode = 'USD') {
  const query = 'UPDATE products SET price = ?, currency_code = ? WHERE product_id = ?';
  const params = [price, currencyCode, productID];

  return dbConnection.execute(query, params, { prepare: true });
}

module.exports = {
  readProduct,
  updateProductPrice,
};
