import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
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
  isVisible: PropTypes.bool.isRequired,
};

/**
 * Creates a mounted MockComponent with the given store.
 * @param {Object} store Redux store.
 * @param {Object} props Component props
 * @returns {JSX.Element}
 */
const renderWithStore = (store, props = {}) => mount(
  <StoreProvider store={store}>
    <MockComponent {...props} />
  </StoreProvider>
);

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
        const wrapper = renderWithStore(store);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(increaseModalCount());
        expect(getModalCount()).toBe(1);

        // Simulate component updates
        wrapper.setProps({ children: <MockComponent someProp /> });
        expect(getModalCount()).toBe(1);
        wrapper.setProps({ children: <MockComponent anotherProp={false} /> });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(getModalCount()).toBe(1);
      });

      it('should dispatch expected actions when unmounted', () => {
        const wrapper = renderWithStore(store);
        expect(getModalCount()).toBe(1);
        wrapper.unmount();
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, increaseModalCount());
        expect(dispatch).toHaveBeenNthCalledWith(2, decreaseModalCount());
        expect(getModalCount()).toBe(0);
      });
    });

    describe('isVisible parameter is set', () => {
      it('should dispatch expected actions when mounted with isVisible true', () => {
        const wrapper = renderWithStore(store, { isVisible: true });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(increaseModalCount());
        expect(getModalCount()).toBe(1);

        // Simulate component updates
        wrapper.setProps({ children: <MockComponent isVisible someProp /> });
        expect(getModalCount()).toBe(1);
        wrapper.setProps({ children: <MockComponent isVisible anotherProp={false} /> });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(getModalCount()).toBe(1);

        wrapper.unmount();
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(getModalCount()).toBe(0);
      });

      it('should dispatch expected actions when mounted with isVisible false and multiple updates', () => {
        const wrapper = renderWithStore(store, { isVisible: false });

        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(getModalCount()).toBe(0);

        // Simulate component updates
        wrapper.setProps({ children: <MockComponent isVisible someProp /> });
        expect(getModalCount()).toBe(1);
        wrapper.setProps({ children: <MockComponent isVisible={false} someProp /> });
        expect(getModalCount()).toBe(0);
        wrapper.setProps({ children: <MockComponent isVisible someProp /> });

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenNthCalledWith(1, increaseModalCount());
        expect(dispatch).toHaveBeenNthCalledWith(2, decreaseModalCount());
        expect(dispatch).toHaveBeenNthCalledWith(3, increaseModalCount());

        expect(getModalCount()).toBe(1);

        wrapper.unmount();
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(dispatch).toHaveBeenNthCalledWith(4, decreaseModalCount());

        expect(getModalCount()).toBe(0);
      });
    });
  });
});
