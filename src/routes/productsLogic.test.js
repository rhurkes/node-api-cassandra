require('mocha');
require('should');
const sinon = require('sinon');
const logic = require('./productsLogic');
const redskyService = require('../services/redskyService');
const productsGateway = require('../gateways/productsGateway');
const resHelper = require('../utility/resHelper');
const logger = require('../utility/logger');

describe('productsLogic', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = null;
  });

  describe('parseProductID', () => {
    it('should return invalid for a string of letters', () => {
      const result = logic.parseProductID('abc');
      result.valid.should.be.false();
    });

    it('should return invalid for a string of numbers with letters at the end', () => {
      const result = logic.parseProductID('1234abc');
      result.valid.should.be.false();
    });

    it('should return valid for a string of numbers', () => {
      const result = logic.parseProductID('1234');
      result.valid.should.be.true();
    });
  });

  describe('getProduct', () => {
    /* eslint-disable camelcase */
    const fakeRes = {
      status: () => ({
        json: x => x,
      }),
    };

    it('should send a 400 error if product ID is invalid', () => {
      const req = {
        params: { id: null },
      };
      const expectedArgs = [
        { status: fakeRes.status },
        400,
        'Invalid product ID',
      ];
      const sendErrorSpy = sandbox.spy(resHelper, 'sendError');
      logic.getProduct(req, fakeRes);
      sendErrorSpy.lastCall.args.should.eql(expectedArgs);
    });

    it('should send a 404 error if productGateway fails', () => {
      const name = 'fake';
      const req = { params: { id: '123' } };
      const res = {
        status: x => ({
          json: values => values,
        }),
      };

      const expected = [
        { status: res.status }, 404, 'Product not found',
      ];

      const resHelperSpy = sandbox.spy(resHelper, 'sendError');

      sandbox.stub(redskyService, 'fetchProduct').callsFake(() => ({
        product: { item: { product_description: { title: name } } },
      }));

      sandbox.stub(productsGateway, 'readProduct').callsFake(() => undefined);

      return logic.getProduct(req, res)
        .then(() => {
          resHelperSpy.lastCall.args.should.be.eql(expected);
        });
    });

    it('should log info if productGateway fails', () => {
      const name = 'fake';
      const req = { params: { id: '123' } };
      const res = {
        status: x => ({
          json: values => values,
        }),
      };

      const loggerSpy = sandbox.spy(logger, 'info');

      sandbox.stub(redskyService, 'fetchProduct').callsFake(() => ({
        product: { item: { product_description: { title: name } } },
      }));

      sandbox.stub(productsGateway, 'readProduct').callsFake(() => undefined);

      return logic.getProduct(req, res)
        .then(() => {
          loggerSpy.calledOnce.should.be.true();
        });
    });

    it('should send a 404 error if redskyService fails', () => {
      const name = 'fake';
      const req = { params: { id: '123' } };
      const res = {
        status: x => ({
          json: values => values,
        }),
      };

      const expected = [
        { status: res.status }, 404, 'Product not found',
      ];

      const resHelperSpy = sandbox.spy(resHelper, 'sendError');

      sandbox.stub(redskyService, 'fetchProduct').callsFake(() => undefined);

      return logic.getProduct(req, res)
        .then(() => {
          resHelperSpy.lastCall.args.should.be.eql(expected);
        });
    });

    it('should log info if redskyService fails', () => {
      const name = 'fake';
      const req = { params: { id: '123' } };
      const res = {
        status: x => ({
          json: values => values,
        }),
      };

      const loggerSpy = sandbox.spy(logger, 'info');

      sandbox.stub(redskyService, 'fetchProduct').callsFake(() => undefined);

      return logic.getProduct(req, res)
        .then(() => {
          loggerSpy.calledOnce.should.be.true();
        });
    });

    it('should call res.json with data from successful calls', () => {
      const id = 123;
      const name = 'fake';
      const current_price = 1;
      const currency_code = 'USD';
      const req = { params: { id: `${id}` } };
      const res = { json: x => x };
      const expected = { id, name, current_price, currency_code };

      sandbox.stub(redskyService, 'fetchProduct').callsFake(() => ({
        product: { item: { product_description: { title: name } } },
      }));

      sandbox.stub(productsGateway, 'readProduct').callsFake(() => ({
        price: current_price, currency_code,
      }));

      return logic.getProduct(req, res)
        .then((data) => {
          data.should.be.eql(expected);
        });
    });
    /* eslint-enable camelcase */
  });

  describe('putProduct', () => {
    const fakeRes = {
      status: () => ({
        json: () => null,
      }),
    };

    it('should send a 400 error if product ID is invalid', () => {
      const req = {
        params: { id: null },
        body: { price: 1 },
      };
      const expectedArgs = [
        { status: fakeRes.status },
        400,
        'Invalid product ID',
      ];
      const sendErrorSpy = sandbox.spy(resHelper, 'sendError');
      logic.putProduct(req, fakeRes);
      sendErrorSpy.lastCall.args.should.eql(expectedArgs);
    });

    it('should send a 400 error if price is NaN', () => {
      const req = {
        params: { id: '123' },
        body: { price: 'a' },
      };
      const expectedArgs = [
        { status: fakeRes.status },
        400,
        'Invalid price',
      ];
      const sendErrorSpy = sandbox.spy(resHelper, 'sendError');
      logic.putProduct(req, fakeRes);
      sendErrorSpy.lastCall.args.should.eql(expectedArgs);
    });

    it('should send a 400 error if price is negative', () => {
      const req = {
        params: { id: '123' },
        body: { price: -1 },
      };
      const expectedArgs = [
        { status: fakeRes.status },
        400,
        'Invalid price',
      ];
      const sendErrorSpy = sandbox.spy(resHelper, 'sendError');
      logic.putProduct(req, fakeRes);
      sendErrorSpy.lastCall.args.should.eql(expectedArgs);
    });

    it('should return product data if update is a success', () => {
      const id = 123;
      const price = 1;
      const req = {
        params: { id: `${id}` },
        body: { price },
      };
      const res = {
        status: () => ({
          json: values => values,
        }),
      };
      const expected = { success: true, id, price };

      sandbox.stub(productsGateway, 'updateProductPrice').callsFake(() => Promise.resolve(true));

      return logic.putProduct(req, res)
        .then((values) => {
          values.should.be.eql(expected);
        });
    });

    it('should send a 200 response if update is a success', () => {
      const id = 123;
      const price = 1;
      const req = {
        params: { id: `${id}` },
        body: { price },
      };
      const res = {
        status: x => ({
          json: values => values,
        }),
      };
      const expected = { success: true, id, price };
      const resSpy = sandbox.spy(res, 'status');

      sandbox.stub(productsGateway, 'updateProductPrice').callsFake(() => Promise.resolve(true));

      return logic.putProduct(req, res)
        .then(() => {
          resSpy.lastCall.args[0].should.be.equal(200);
        });
    });

    it('should send a 500 response if update promise rejects', () => {
      const req = {
        params: { id: '123' },
        body: { price: 1 },
      };
      const res = {
        status: x => ({
          json: values => values,
        }),
      };
      const expected = [
        { status: res.status }, 500, 'Internal server error',
      ];

      const resHelperSpy = sandbox.spy(resHelper, 'sendError');
      sandbox.stub(productsGateway, 'updateProductPrice').callsFake(() => Promise.reject(true));

      return logic.putProduct(req, res)
        .then((x) => {
          resHelperSpy.lastCall.args.should.be.eql(expected);
        });
    });

    it('should log a warning if update promise rejects', () => {
      const req = {
        params: { id: '123' },
        body: { price: 1 },
      };
      const res = {
        status: x => ({
          json: values => values,
        }),
      };

      const loggerSpy = sandbox.spy(logger, 'warn');
      sandbox.stub(productsGateway, 'updateProductPrice').callsFake(() => Promise.reject(true));

      return logic.putProduct(req, res)
        .then((x) => {
          loggerSpy.calledOnce.should.be.true();
        });
    });
  });
});
