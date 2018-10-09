import {
  categoryRouteDidEnter$,
  categoryError$,
} from '@shopgate/pwa-common-commerce/category/streams';
import subscriptions from './subscriptions';

const mockedGetCategory = jest.fn();
jest.mock(
  '@shopgate/pwa-common-commerce/category/actions/getCategory',
  () => (...args) => mockedGetCategory(...args)
);

jest.mock('@shopgate/pwa-common-commerce/category/selectors', () => ({
  getCurrentCategoryId: () => 1,
}));

const mockedShowModal = jest.fn();
jest.mock(
  '@shopgate/pwa-common/actions/modal/showModal',
  () => (...args) => mockedShowModal(...args)
);

describe('Category subscriptions', () => {
  beforeEach(() => {
    mockedShowModal.mockReset();
  });
  const subscribe = jest.fn();
  const expectedStreams = {
    categoryRouteDidEnter$: {
      func: categoryRouteDidEnter$,
      cb: null,
    },
    categoryError$: {
      func: categoryError$,
      cb: null,
    },
  };

  it('should subscribe to streams', () => {
    subscriptions(subscribe);
    subscribe.mock.calls.forEach(([func, cb]) => {
      Object.keys(expectedStreams).forEach((key) => {
        const expected = expectedStreams[key];
        if (expected.func === func) {
          expected.cb = cb;
        }
      });
    });
    Object.keys(expectedStreams).forEach((key) => {
      expect(typeof expectedStreams[key].cb === 'function').toBe(true);
    });
  });

  it('should dispatch actions on categoryRouteDidEnter$', () => {
    const dispatch = jest.fn();
    /**
     * This function does nothing.
     */
    const getState = () => {};
    expectedStreams.categoryRouteDidEnter$.cb({
      dispatch,
      getState,
    });
    expect(dispatch).toHaveBeenCalled();
    expect(mockedGetCategory).toHaveBeenCalledWith(1);
  });

  it('should dispatch actions on categoryError$ with generic error', () => {
    const dispatch = jest.fn();
    const action = { errorCode: 'EUNKNOWN' };
    expectedStreams.categoryError$.cb({
      action,
      dispatch,
    });

    expect(dispatch).toHaveBeenCalled();
    expect(mockedShowModal).toHaveBeenCalled();
    expect(mockedShowModal.mock.calls[0][0].message).toBe('modal.body_error');
  });

  it('should dispatch actions on categoryError$ with not found error', () => {
    const dispatch = jest.fn();
    const action = { errorCode: 'ENOTFOUND' };
    expectedStreams.categoryError$.cb({
      action,
      dispatch,
    });

    expect(dispatch).toHaveBeenCalled();
    expect(mockedShowModal).toHaveBeenCalled();
    expect(mockedShowModal.mock.calls[0][0].message).toBe('category.error.not_found');
  });
});
