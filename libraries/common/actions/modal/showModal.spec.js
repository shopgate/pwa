import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { logger } from '@shopgate/pwa-core/helpers';
import showModal, { getModalId } from './showModal';
import { CREATE_MODAL } from '../../constants/ActionTypes';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    warn: jest.fn(),
  },
}));

const modalEntry = {
  confirm: null,
  dismiss: 'modal.dismiss',
  message: 'Message',
  params: {},
  title: 'Title',
  type: null,
};

const mockedState = {
  modal: [
    {
      ...modalEntry,
    },
  ],
};

mockedState.modal[0].id = getModalId(modalEntry);

/**
 * Creates a mocked store.
 * @param {Object} state The mocked state.
 * @return {Object}
 */
const createStore = (state = {}) => configureStore([thunk])(state);

describe('Modal actions - showModal()', () => {
  it('should work as expected for a new modal', () => {
    const { dispatch, getState, getActions } = createStore(mockedState);

    // Use a fresh set of modal options which is not available whith the store.
    const modalOptions = {
      ...modalEntry,
      message: 'Fresh entry',
    };

    // Simulate dispatch of the action.
    const result = showModal(modalOptions)(dispatch, getState);
    // Should return a pending promise.
    expect(result).toBeInstanceOf(Promise);

    const actions = getActions();
    expect(actions).toHaveLength(1);

    const createModalAction = actions[0];

    // Inspect the action payload of the actual modal creation.
    expect(createModalAction.type).toEqual(CREATE_MODAL);
    expect(createModalAction.options).toEqual({
      ...modalOptions,
      id: getModalId(modalOptions),
    });
  });

  it('should resolve with null when a duplicate would be created', async () => {
    const { dispatch, getState, getActions } = createStore(mockedState);

    const modalOptions = {
      ...modalEntry,
    };

    // Simulate dispatch of the action.
    const result = await showModal(modalOptions)(dispatch, getState);
    expect(result).toBeNull();
    expect(getActions()).toHaveLength(0);
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });
});

