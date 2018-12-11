import { createMockStore } from '@shopgate/pwa-common/store';
import { pwaDidAppear } from '../action-creators';
import { pwaDidAppear$ } from './app';

let mockedPattern;
jest.mock('@shopgate/pwa-common/helpers/router', () => ({
  getCurrentRoute: () => ({
    pattern: mockedPattern,
  }),
}));

describe('App streams', () => {
  let pwaDidAppearSubscriber;
  let dispatch;

  beforeEach(() => {
    mockedPattern = '';
    jest.clearAllMocks();
    ({ dispatch } = createMockStore());
    pwaDidAppearSubscriber = jest.fn();
    pwaDidAppear$.subscribe(pwaDidAppearSubscriber);
  });

  describe('pwaDidAppear$', () => {
    it('should emit when the pwaDidAppear action is dispatched', () => {
      mockedPattern = '/somepath';
      dispatch(pwaDidAppear());

      expect(pwaDidAppearSubscriber).toHaveBeenCalledTimes(1);
      const [[{ action }]] = pwaDidAppearSubscriber.mock.calls;
      expect(action.route.pattern).toEqual(mockedPattern);
    });

    it('should not emit when another action is dispatched', () => {
      dispatch({ type: 'someaction' });
      expect(pwaDidAppearSubscriber).not.toHaveBeenCalled();
    });
  });
});
