import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import { combineReducers } from 'redux';
import { Provider as StoreProvider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import a11y from '../reducers';
import { useTrackModalState } from './index';
import { increaseModalCount, decreaseModalCount } from '../action-creators';

/**
 * @param {Object} props The component props.
 * @param {boolean} props.isVisible The visibility state of the modal.
 * @returns {JSX.Element}
 */
const MockComponent = ({ isVisible }) => {
  useTrackModalState(isVisible);
  return null;
};

MockComponent.propTypes = {
  isVisible: PropTypes.bool,
};

MockComponent.defaultProps = {
  isVisible: undefined,
};

/**
 * Creates a rendered MockComponent with the given store.
 * @param {Object} store Redux store.
 * @param {Object} props Component props
 * @returns {Object}
 */
const renderWithStore = (store, props = {}) => {
  const rendered = render(
    <StoreProvider store={store}>
      <MockComponent {...props} />
    </StoreProvider>
  );

  return {
    ...rendered,
    rerenderWithStore: (nextProps = {}) => rendered.rerender(
      <StoreProvider store={store}>
        <MockComponent {...nextProps} />
      </StoreProvider>
    ),
  };
};

describe('engage > a11y > hooks', () => {
  describe('useTrackModalState()', () => {
    let store;
    let dispatch;

    beforeEach(() => {
      jest.clearAllMocks();

      store = createMockStore(combineReducers({
        a11y,
      }));

      const originalDispatch = store.dispatch;

      store.dispatch = jest.fn((...args) => {
        originalDispatch(...args);
      });
      ({ dispatch } = store);
    });

    /**
     * @returns {number} The current modal count from the store.
     */
    const getModalCount = () => store.getState().a11y.modalCount;

    describe('isVisible parameter is NOT set', () => {
      it('should dispatch expected actions when mounted', () => {
        const rendered = renderWithStore(store);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(increaseModalCount());
        expect(getModalCount()).toBe(1);

        // Simulate component updates
        rendered.rerenderWithStore({ someProp: true });
        expect(getModalCount()).toBe(1);
        rendered.rerenderWithStore({ anotherProp: false });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(getModalCount()).toBe(1);
      });

      it('should dispatch expected actions when unmounted', () => {
        const rendered = renderWithStore(store);
        expect(getModalCount()).toBe(1);
        rendered.unmount();
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, increaseModalCount());
        expect(dispatch).toHaveBeenNthCalledWith(2, decreaseModalCount());
        expect(getModalCount()).toBe(0);
      });
    });

    describe('isVisible parameter is set', () => {
      it('should dispatch expected actions when mounted with isVisible true', () => {
        const rendered = renderWithStore(store, { isVisible: true });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(increaseModalCount());
        expect(getModalCount()).toBe(1);

        // Simulate component updates
        rendered.rerenderWithStore({
          isVisible: true,
          someProp: true,
        });
        expect(getModalCount()).toBe(1);
        rendered.rerenderWithStore({
          isVisible: true,
          anotherProp: false,
        });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(getModalCount()).toBe(1);

        rendered.unmount();
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(getModalCount()).toBe(0);
      });

      it('should dispatch expected actions when mounted with isVisible false and multiple updates', () => {
        const rendered = renderWithStore(store, { isVisible: false });

        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(getModalCount()).toBe(0);

        // Simulate component updates
        rendered.rerenderWithStore({
          isVisible: true,
          someProp: true,
        });
        expect(getModalCount()).toBe(1);
        rendered.rerenderWithStore({
          isVisible: false,
          someProp: true,
        });
        expect(getModalCount()).toBe(0);
        rendered.rerenderWithStore({
          isVisible: true,
          someProp: true,
        });

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenNthCalledWith(1, increaseModalCount());
        expect(dispatch).toHaveBeenNthCalledWith(2, decreaseModalCount());
        expect(dispatch).toHaveBeenNthCalledWith(3, increaseModalCount());

        expect(getModalCount()).toBe(1);

        rendered.unmount();
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(dispatch).toHaveBeenNthCalledWith(4, decreaseModalCount());

        expect(getModalCount()).toBe(0);
      });
    });
  });
});
