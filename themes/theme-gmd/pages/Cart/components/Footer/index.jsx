import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TaxDisclaimer } from '@shopgate/engage/components';
import CouponsHint from './components/CouponsHint';
import connect from './connector';

/**
 * The Footer component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Footer = ({ showTaxDisclaimer, showCouponsHint }) => (
  <Fragment>
    {showCouponsHint && <CouponsHint />}
    {showTaxDisclaimer && <TaxDisclaimer />}
  </Fragment>
);

Footer.propTypes = {
  showCouponsHint: PropTypes.bool.isRequired,
  showTaxDisclaimer: PropTypes.bool.isRequired,
};

export default connect(Footer);
