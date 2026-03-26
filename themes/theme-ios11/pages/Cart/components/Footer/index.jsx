import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FLAG_MULTI_LINE_RESERVE, CartContext, SupplementalContent } from '@shopgate/engage/cart';
import TaxDisclaimer from '@shopgate/pwa-ui-shared/TaxDisclaimer';
import { makeStyles } from '@shopgate/engage/styles';
import CouponsHint from './components/CouponsHint';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  supplementalContent: {
    padding: [theme.spacing(2), '!important'],
  },
}));

/**
 * The Footer component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Footer = ({ showTaxDisclaimer, showCouponsHint }) => {
  const { classes } = useStyles();
  const { flags } = useContext(CartContext);

  return (
    <>
      {!flags[FLAG_MULTI_LINE_RESERVE] && showCouponsHint && <CouponsHint />}
      {flags[FLAG_MULTI_LINE_RESERVE]
      && <SupplementalContent className={classes.supplementalContent} />}
      {showTaxDisclaimer && <TaxDisclaimer />}
    </>
  );
};
Footer.propTypes = {
  showCouponsHint: PropTypes.bool.isRequired,
  showTaxDisclaimer: PropTypes.bool.isRequired,
};

export default connect(Footer);
