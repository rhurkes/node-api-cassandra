// Because of the way Express routes work, you can either do ugly stubbing and import supertest,
// or abstract the logic out of your routes. This file implements the latter.

const logger = require('../utility/logger');
const resHelper = require('../utility/resHelper');
const productsGateway = require('../gateways/productsGateway');
const redskyService = require('../services/redskyService');

const numericRegex = new RegExp('[0-9]+$');

/**
 * Takes request context parameter's value and returns an object containing the parsed value
 * and whether it is a valid product ID.
 * @param {string} id
 */
function parseProductID(id) {
  // Also need to regex the id, since parseInt('123hi') will silently return 123
  const productID = parseInt(id, 10);

  return {
    valid: !isNaN(productID) && numericRegex.test(id) && productID >= 0,
    id: productID,
  };
}

/**
 * Retrieves aggregation of redsky service and pricing database for a request product.
 * @param {object} req node request object
 * @param {object} res node response object
 * @returns {void}
 */
function getProduct(req, res) {
  const parsedID = parseProductID(req.params.id);

  if (!parsedID.valid) {
    return resHelper.sendError(res, 400, 'Invalid product ID');
  }

  return Promise.all([
    redskyService.fetchProduct(parsedID.id),
    productsGateway.readProduct(parsedID.id),
  ]).then((results) => {
    const redskyServiceResp = results[0];
    const productGatewayResp = results[1];

    // Assumption: business logic that if redsky doesn't have a result or a result with a product
    // description, and/or the price database doesn't have a result, the product does not exist.
    if (!redskyServiceResp || !redskyServiceResp.product || !redskyServiceResp.product.item
        || !redskyServiceResp.product.item.product_description) {
      logger.info('redskyService', { id: parsedID.id, message: 'product not found' });
      return resHelper.sendError(res, 404, 'Product not found');
    }

    if (!productGatewayResp) {
      logger.info('productGateway', { id: parsedID.id, message: 'product not found' });
      return resHelper.sendError(res, 404, 'Product not found');
    }

    return res.json({
      id: parsedID.id,
      name: redskyServiceResp.product.item.product_description.title,
      current_price: productGatewayResp.price,
      currency_code: productGatewayResp.currency_code,
    });
  });
}

/**
 * Updates a product's price in the pricing database.
 * @param {object} req node request object
 * @param {object} res node response object
 * @returns {void}
 */
function putProduct(req, res) {
  const parsedID = parseProductID(req.params.id);
  if (!parsedID.valid) {
    return resHelper.sendError(res, 400, 'Invalid product ID');
  }

  const price = parseFloat(req.body.price);
  if (isNaN(price) || price < 0) {
    return resHelper.sendError(res, 400, 'Invalid price');
  }

  return productsGateway.updateProductPrice(parsedID.id, price)
    .then(() => res.status(200).json({
      success: true,
      id: parsedID.id,
      price,
    }))
    .catch((err) => {
      logger.warn('PUT products', err);
      return resHelper.sendError(res, 500, 'Internal server error');
    });
}

module.exports = {
  parseProductID,
  getProduct,
  putProduct,
};
