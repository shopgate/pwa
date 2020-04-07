const initialState = {
  paymentMethods: {
    isFetching: false,
    data: [],
  },
  checkoutOrder: {
    isFetching: false,
    data: null,
    errors: [],
  },
  checkoutSubmit: {
    errors: [],
  },
};

/**
 * The reducer for all checkout related state.
 * @param {Object} state The application state.
 * @param {Object} action The redux action.
 * @returns {Object}
 */
export default function checkoutReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
