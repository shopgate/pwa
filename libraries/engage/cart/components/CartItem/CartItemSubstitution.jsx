import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';
import {
  BOPIS,
  ROPIS,
} from '@shopgate/engage/locations';
import connect from './CartItemSubstitution.connector';
import { useCartItem } from './CartItem.hooks';
import Substitution, { SubstitutionWrapper } from '../Substitution';

const { gap } = themeVariables;

const useStyles = makeStyles()({
  root: {
    padding: gap.big,
    borderTop: `1px solid ${themeColors.shade7}`,
  },
});

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @param {Function} props.setSubstitutionAllowed The action to set substitution allowed flag.
 * @param {boolean} props.editable Whether the substitution option is editable.
 * @returns {JSX.Element}
 */
const CartItemSubstitution = ({ setSubstitutionAllowed, editable }) => {
  const { classes } = useStyles();
  const { cartItem: { id, substitutionAllowed, fulfillment } = {} } = useCartItem();

  if (![ROPIS, BOPIS].includes(fulfillment?.method || [])) {
    return null;
  }

  return (
    <SubstitutionWrapper>
      <Substitution
        className={classes.root}
        id={`substitution-${id}`}
        label={i18n.text('cart.allow_substitution')}
        checked={substitutionAllowed}
        onChange={() => setSubstitutionAllowed(id, !substitutionAllowed)}
        disabled={!editable}
      />
    </SubstitutionWrapper>
  );
};

CartItemSubstitution.propTypes = {
  setSubstitutionAllowed: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

CartItemSubstitution.defaultProps = {
  editable: false,
};

export default connect(CartItemSubstitution);
