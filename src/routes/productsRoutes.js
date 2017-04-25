const router = require('express').Router();
const productsLogic = require('./productsLogic');

// GET products
router.get('/:id', (req, res) => {
  productsLogic.getProduct(req, res);
});

// PUT products
router.put('/:id', (req, res) => {
  productsLogic.putProduct(req, res);
});

module.exports = router;
