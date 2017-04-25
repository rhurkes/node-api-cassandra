require('mocha');
const should = require('should');
const sinon = require('sinon');
const productsGateway = require('./productsGateway');
const dbConnection = require('../utility/dbConnection');
const logger = require('../utility/logger');

describe('productsGateway', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = null;
  });

  describe('readProduct', () => {
    it('should return db results if the price is valid', () => {
      const fakeDBResponse = { price: 1, currency_code: 'USD' };
      sandbox.stub(dbConnection, 'execute').callsFake(() => Promise.resolve({
        first: () => Promise.resolve(fakeDBResponse),
      }));

      return productsGateway.readProduct()
        .then((data) => {
          data.should.be.eql(fakeDBResponse);
        });
    });

    it('should return undefined if the price is negative', () => {
      const fakeDBResponse = { price: -1, currency_code: 'USD' };
      sandbox.stub(dbConnection, 'execute').callsFake(() => Promise.resolve({
        first: () => Promise.resolve(fakeDBResponse),
      }));

      return productsGateway.readProduct()
        .then((data) => {
          should(data).be.equal(undefined);
        });
    });

    it('should return undefined if the price is not a number', () => {
      const fakeDBResponse = { price: 'a', currency_code: 'USD' };
      sandbox.stub(dbConnection, 'execute').callsFake(() => Promise.resolve({
        first: () => Promise.resolve(fakeDBResponse),
      }));

      return productsGateway.readProduct()
        .then((data) => {
          should(data).be.equal(undefined);
        });
    });

    it('should log a warning when price is invalid', () => {
      const fakeDBResponse = { price: 'a', currency_code: 'USD' };
      const expectedLogMessage = {
        id: undefined,
        message: 'invalid price found',
      };
      const loggerSpy = sandbox.spy(logger, 'warn');
      sandbox.stub(dbConnection, 'execute').callsFake(() => Promise.resolve({
        first: () => Promise.resolve(fakeDBResponse),
      }));

      return productsGateway.readProduct()
        .then(() => {
          const call = loggerSpy.getCall(0);
          call.args.should.be.eql(['readProduct', expectedLogMessage]);
        });
    });
  });

  describe('updateProductPrice', () => {
    it('should return data from the database if successful', () => {
      const productID = 123;
      const price = 1;
      const currencyCode = 'USD';
      const fakeDBResponse = { success: true };
      sandbox.stub(dbConnection, 'execute').callsFake(() => Promise.resolve(fakeDBResponse));

      return productsGateway.updateProductPrice(productID, price, currencyCode)
        .then((data) => {
          data.should.be.eql(fakeDBResponse);
        });
    });
  });
});
