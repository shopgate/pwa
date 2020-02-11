import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FLAG_MULTI_LINE_RESERVE } from '@shopgate/engage/cart';
import TaxDisclaimer from '@shopgate/pwa-ui-shared/TaxDisclaimer';
import CartContext from '../../context';
import CouponsHint from './components/CouponsHint';
import ReservationHint from './components/ReservationHint';
import connect from './connector';

/**
 * The Footer component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Footer = ({ showTaxDisclaimer, showCouponsHint }) => (
  <CartContext.Consumer>
    {({ flags }) => (
      <Fragment>
        {!flags[FLAG_MULTI_LINE_RESERVE] && showCouponsHint && <CouponsHint />}
        {flags[FLAG_MULTI_LINE_RESERVE] && <ReservationHint />}
        {showTaxDisclaimer && <TaxDisclaimer />}
      </Fragment>
    )}
  </CartContext.Consumer>
);

Footer.propTypes = {
  showCouponsHint: PropTypes.bool.isRequired,
  showTaxDisclaimer: PropTypes.bool.isRequired,
};

export default connect(Footer);
