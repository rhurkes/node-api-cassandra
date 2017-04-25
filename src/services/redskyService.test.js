require('mocha');
const should = require('should');
const request = require('request-promise-native');
const sinon = require('sinon');
const redskyService = require('./redskyService');
const logger = require('../utility/logger');

describe('redskyService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = null;
  });

  describe('fetchProduct', () => {
    it('should resolve the response when there are no errors requesting', () => {
      const fakeResponse = {};
      sandbox.stub(request, 'get').callsFake(() => Promise.resolve(fakeResponse));

      return redskyService.fetchProduct()
        .then((data) => {
          data.should.be.eql(fakeResponse);
        });
    });

    it('should reject with undefined when there are errors requesting', () => {
      const fakeResponse = {};
      sandbox.stub(request, 'get').callsFake(() => Promise.reject(fakeResponse));

      return redskyService.fetchProduct()
        .then((data) => {
          should(data).be.equal(undefined);
        });
    });

    it('should log a warning with a rejection', () => {
      const fakeResponse = {};
      const loggerSpy = sandbox.spy(logger, 'warn');
      sandbox.stub(request, 'get').callsFake(() => Promise.reject(fakeResponse));

      return redskyService.fetchProduct()
        .then(() => {
          const call = loggerSpy.getCall(0);
          call.args.should.be.eql(['fetchProducts', fakeResponse]);
        });
    });
  });
});
