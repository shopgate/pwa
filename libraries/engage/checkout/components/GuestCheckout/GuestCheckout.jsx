import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from './GuestCheckout.connector';

/**
 * The GuestCheckout component
 * @returns {JSX}
 */
const GuestCheckout = ({ test }) => (
  <Fragment>
    <div>Guest Checkout</div>
    <button
      type="button"
      onClick={() => {
        test();
      }}
    >
      Test

    </button>
  </Fragment>
);

GuestCheckout.defaultProps = {
  test: () => { },
};

GuestCheckout.propTypes = {
  test: PropTypes.func,
};

export default connect(GuestCheckout);
