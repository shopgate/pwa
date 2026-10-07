/* eslint-disable no-unused-vars */
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '../../store';
import modalReducer from '../../reducers/modal';
import showModal from '../../actions/modal/showModal';
import ModalContainer from './index';

// const store = configureStore({ modal: modalReducer });
// Replacement for commented out configureStore()
const store = {};

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
    <button className="confirmBtn" onClick={onConfirm} type="button">confirm</button>
    <button className="dismissBtn" onClick={onDismiss} type="button">dismiss</button>
  </div>
);

describe.skip('<ModalContainer />', () => {
  let container;
  const { dispatch, getState } = store;

  /**
   * The rendered component.
   */
  const renderComponent = () => {
    ({ container } = render((
      <Provider store={store}>
        <div id="container">
          <ModalContainer component={MockModal} />
        </div>
      </Provider>
    )));
  };

  beforeEach(() => {
    // Reset the modals state before each test.
    getState().modal = [];
    renderComponent();
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should render nothing without a modal', () => {
      expect(container.firstChild).toHaveAttribute('id', 'container');
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it('should show no modal', () => {
      expect(container.querySelectorAll('.modal').length).toBe(0);
    });

    describe('Given a modal gets dispatched', () => {
      let modalPromise;

      beforeEach(() => {
        act(() => {
          modalPromise = dispatch(showModal({
            title: 'Title',
            message: 'Message',
          }));
        });
      });

      it('should contain a modal item in the state', () => {
        expect(getState().modal.length).toBe(1);
      });

      it('should show the modal', () => {
        expect(container.querySelectorAll('.modal').length).toBe(1);
      });

      describe('Given the modal gets confirmed', () => {
        beforeEach(() => {
          fireEvent.click(screen.getByRole('button', { name: 'confirm' }));
        });

        it('should resolve the promise as confirmed', async () => {
          await expect(modalPromise).resolves.toBe(true);
        });

        it('should contain no modal item in the state', () => {
          expect(getState().modal.length).toBe(0);
        });

        it('should not show the modal anymore', () => {
          expect(container.querySelectorAll('.modal').length).toBe(0);
        });
      });

      describe('Given the modal gets dismissed', () => {
        beforeEach(() => {
          fireEvent.click(screen.getByRole('button', { name: 'dismiss' }));
        });

        it('should resolve the promise as dismissed', async () => {
          await expect(modalPromise).resolves.toBe(false);
        });
      });
    });
  });
});

/* eslint-enable no-unused-vars */
