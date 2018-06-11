import { createStore } from './specHelper';
import { pwaDidAppear } from '../action-creators';
import { pwaDidAppear$ } from './app';

describe('App streams', () => {
  let mockedDidAppearSubscriber;

  beforeEach(() => {
    mockedDidAppearSubscriber = jest.fn();
    pwaDidAppear$.subscribe(mockedDidAppearSubscriber);
  });

  describe('pwaDidAppear$', () => {
    it('should emit when the pwaDidAppear action is dispatched', () => {
      const mockedPathname = '/somepath';
      const { dispatch } = createStore(mockedPathname);

      dispatch(pwaDidAppear());

      expect(mockedDidAppearSubscriber).toHaveBeenCalledTimes(1);
      const [[{ pathname }]] = mockedDidAppearSubscriber.mock.calls;
      expect(pathname).toEqual(mockedPathname);
    });

    it('should not emit when another action is dispatched', () => {
      const { dispatch } = createStore();
      dispatch({ type: 'someaction' });
      expect(mockedDidAppearSubscriber).not.toHaveBeenCalled();
    });
  });
});
