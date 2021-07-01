import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import TaxDisclaimer from '@shopgate/pwa-ui-shared/TaxDisclaimer';
import CouponsHint from './components/CouponsHint';
import connect from './connector';

/**
 * The Footer component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Footer = ({ hasCartItems, showCouponsHint }) => (
  <Fragment>
    {showCouponsHint && <CouponsHint />}
    {hasCartItems && <TaxDisclaimer />}
  </Fragment>
);

Footer.propTypes = {
  hasCartItems: PropTypes.bool.isRequired,
  showCouponsHint: PropTypes.bool.isRequired,
};

export default connect(Footer);
