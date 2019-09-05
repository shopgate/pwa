/* eslint-disable no-unused-vars */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { configureStore } from '../../store';
import modalReducer from '../../reducers/modal';
import showModal from '../../actions/modal/showModal';
import ModalContainer from './index';

// const store = configureStore({ modal: modalReducer });
// Replacement for commented out configureStore()
const store = {};
jest.mock('react-portal', () => (
  ({ isOpened, children }) => (
    isOpened ? children : null
  )
));

jest.mock('redux-logger', () => ({
  createLogger: () => () => next => action => next(action),
}));

global.requestAnimationFrame = fn => fn();

/**
 * Some mock modal component.
 * @param {func} onConfirm Confirm callback
 * @param {func} onDismiss Dismiss callback
 * @constructor
 */
const MockModal = ({
  onConfirm, // eslint-disable-line react/prop-types
  onDismiss, // eslint-disable-line react/prop-types
}) => (
  <div className="modal">
    <button className="confirmBtn" onClick={onConfirm} type="button" />
    <button className="dismissBtn" onClick={onDismiss} type="button" />
  </div>
);

describe.skip('<ModalContainer />', () => {
  let renderedElement;
  const { dispatch, getState } = store;

  /**
   * The rendered component.
   */
  const renderComponent = () => {
    renderedElement = mount((
      <Provider store={store}>
        <div id="container">
          <ModalContainer component={MockModal} />
        </div>
      </Provider>
    ));
  };

  beforeEach(() => {
    // Reset the modals state before each test.
    getState().modal = [];
    renderComponent();
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should show no modal', () => {
      expect(renderedElement.find('.modal').length).toBe(0);
    });

    describe('Given a modal gets dispatched', () => {
      let modalPromise;

      beforeEach(() => {
        modalPromise = dispatch(showModal({
          title: 'Title',
          message: 'Message',
        }));

        renderedElement.update();
      });

      it('should contain a modal item in the state', () => {
        expect(getState().modal.length).toBe(1);
      });

      it('should show the modal', () => {
        expect(renderedElement.find('.modal').length).toBe(1);
      });

      describe('Given the modal gets confirmed', () => {
        beforeEach(() => {
          renderedElement.find('.confirmBtn').simulate('click');
        });

        it('should resolve the promise as confirmed', () => {
          modalPromise.then(confirmed => (
            expect(confirmed).toBe(true)
          ));
        });

        it('should contain no modal item in the state', () => {
          expect(getState().modal.length).toBe(0);
        });

        it('should not show the modal anymore', () => {
          expect(renderedElement.find('.modal').length).toBe(0);
        });
      });

      describe('Given the modal gets dismissed', () => {
        beforeEach(() => {
          renderedElement.find('.dismissBtn').simulate('click');
        });

        it('should resolve the promise as dismissed', () => {
          modalPromise.then(confirmed => (
            expect(confirmed).toBe(false)
          ));
        });
      });
    });
  });
});

/* eslint-enable no-unused-vars */
