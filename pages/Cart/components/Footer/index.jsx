import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { FLAG_MULTI_LINE_RESERVE, CartContext, SupplementalContent } from '@shopgate/engage/cart';
import TaxDisclaimer from '@shopgate/pwa-ui-shared/TaxDisclaimer';
import CouponsHint from './components/CouponsHint';
import { supplementalContent } from './style';
import connect from './connector';

/**
 * The Footer component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Footer = ({ showTaxDisclaimer, showCouponsHint }) => {
  const { flags } = useContext(CartContext);

  return (
    <Fragment>
      {!flags[FLAG_MULTI_LINE_RESERVE] && showCouponsHint && <CouponsHint />}
      {flags[FLAG_MULTI_LINE_RESERVE] && <SupplementalContent className={supplementalContent} />}
      {showTaxDisclaimer && <TaxDisclaimer />}
    </Fragment>
  );
};
Footer.propTypes = {
  showCouponsHint: PropTypes.bool.isRequired,
  showTaxDisclaimer: PropTypes.bool.isRequired,
};

export default connect(Footer);
