import { createMockStore } from '../store';
import { pwaDidAppear, pwaDidDisappear } from '../action-creators';
import { pwaDidAppear$, pwaDidDisappear$ } from './app';

let mockedPattern;
jest.mock('../selectors/router', () => ({
  getCurrentRoute: () => ({
    pattern: mockedPattern,
  }),
}));

describe('App streams', () => {
  let pwaDidAppearSubscriber;
  let pwaDidDisappearSubscriber;
  let dispatch;

  beforeEach(() => {
    mockedPattern = '';
    jest.clearAllMocks();
    ({ dispatch } = createMockStore());
    pwaDidAppearSubscriber = jest.fn();
    pwaDidDisappearSubscriber = jest.fn();
    pwaDidAppear$.subscribe(pwaDidAppearSubscriber);
    pwaDidDisappear$.subscribe(pwaDidDisappearSubscriber);
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

  describe('pwaDidDisappear$', () => {
    it('should emit when the pwaDidDisappear action is dispatched', () => {
      mockedPattern = '/somepath';
      dispatch(pwaDidDisappear());

      expect(pwaDidDisappearSubscriber).toHaveBeenCalledTimes(1);
      const [[{ action }]] = pwaDidDisappearSubscriber.mock.calls;
      expect(action.route.pattern).toEqual(mockedPattern);
    });

    it('should not emit when another action is dispatched', () => {
      dispatch({ type: 'someaction' });
      expect(pwaDidDisappearSubscriber).not.toHaveBeenCalled();
    });
  });
});
