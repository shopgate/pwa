import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Availability, SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY } from '@shopgate/pwa-common-commerce/product';
import connect from './VariantAvailability.connector';

const useStyles = makeStyles()({
  availability: {
    float: 'right',
    pointerEvents: 'none',
  },
});

/**
 * The VariantAvailability component.
 * @param {Object} availability availability
 * @returns {JSX}
 */
const VariantAvailability = ({ availability }) => {
  const { classes } = useStyles();

  if (!availability) {
    return null;
  }

  const { state, text } = availability;
  return (
    <SurroundPortals
      portalName={PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY}
      portalProps={availability}
    >
      <Availability className={classes.availability} state={state} text={text} />
    </SurroundPortals>
  );
};

VariantAvailability.propTypes = {
  availability: PropTypes.shape({
    state: PropTypes.string,
    text: PropTypes.string,
  }),
};

VariantAvailability.defaultProps = {
  availability: null,
};

export default connect(memo(VariantAvailability));
