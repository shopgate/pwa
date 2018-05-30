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
const Footer = ({ showTaxDisclaimer, showCouponsHint }) => (
  <div data-test-id="footer">
    <Fragment>
      {showCouponsHint && <CouponsHint />}
      {showTaxDisclaimer && <TaxDisclaimer />}
    </Fragment>
  </div>
);

Footer.propTypes = {
  showCouponsHint: PropTypes.bool.isRequired,
  showTaxDisclaimer: PropTypes.bool.isRequired,
};

export default connect(Footer);
