import * as Sentry from '@sentry/browser';
import { errorCheckout } from './errorCheckout';

jest.mock('@sentry/browser', () => ({
  withScope: jest.fn(),
  captureMessage: jest.fn(),
  captureException: jest.fn(),
}));
jest.mock('@shopgate/engage/core', () => ({
  showModal: jest.fn(options => ({
    type: 'SHOW_MODAL',
    options,
  })),
  historyResetTo: jest.fn(() => ({ type: 'HISTORY_RESET_TO' })),
  historyPop: jest.fn(() => ({ type: 'HISTORY_POP' })),
  INDEX_PATH: '/',
}));
jest.mock('@shopgate/engage/cart', () => ({ CART_PATH: '/cart' }));
jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getRouterStackIndex: jest.fn(() => 1),
  makeGetPrevRouteIndexByPattern: () => jest.fn(() => -1),
}));

describe('engage > checkout > actions > errorCheckout', () => {
  const scope = {
    setLevel: jest.fn(),
    setTag: jest.fn(),
    setExtra: jest.fn(),
  };
  const error = {
    code: 'EVALIDATION',
    message: 'Street "Main St 1" is invalid for jane@example.com',
    errors: [{
      code: 'EINVALIDADDRESS',
      message: 'Main St 1',
    }],
    validationErrors: [{
      path: 'billing.street',
      message: 'Main St 1',
    }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Sentry.withScope.mockImplementation(callback => callback(scope));
  });

  it('should report only codes and the pipeline to Sentry', () => {
    errorCheckout('checkout.errors.generic', 'shopgate.checkout.submit', error)(jest.fn(), jest.fn());

    expect(Sentry.captureMessage).toHaveBeenCalledWith('Checkout error EVALIDATION');
    expect(Sentry.captureException).not.toHaveBeenCalled();
    expect(scope.setLevel).toHaveBeenCalledWith('fatal');
    expect(scope.setTag).toHaveBeenCalledWith('errorCode', 'EVALIDATION');
    expect(scope.setExtra.mock.calls).toEqual([
      ['origin', 'checkout'],
      ['pipeline', 'shopgate.checkout.submit'],
      ['subCode', 'EINVALIDADDRESS'],
    ]);
    expect(JSON.stringify([
      Sentry.captureMessage.mock.calls,
      scope.setTag.mock.calls,
      scope.setExtra.mock.calls,
    ])).not.toMatch(/Main St|jane@example\.com/);
  });
});
