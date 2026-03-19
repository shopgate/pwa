import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import FulfillmentSlotSwitcherDefault from './FulfillmentSlotSwitcherDefault';
import FulfillmentSlotSwitcherBar from './FulfillmentSlotSwitcherBar';
import connect from './FulfillmentSlotSwitcher.connector';
import { forceOpenFulfillmentSlotDialog } from './FulfillmentSlotProvider';

const useStyles = makeStyles()({
  card: {
    boxShadow: '0px 4px 2px rgba(0, 0, 0, 0.05)',
    marginBottom: 16,
    ' > div > div': {
      borderBottom: 0,
    },
    ' > div': {
      borderRadius: 5,
      margin: -1,
      background: '#fff',
      border: '1px solid #eaeaea',
    },
  },
});

/**
 * @returns {JSX}
 */
const FulfillmentSlotSwitcher = ({
  fulfillmentSlot,
  renderBar,
  isFulfillmentScheduling,
  isFulfillmentSlotValid,
  standalone,
  card,
  editable,
}) => {
  const { classes } = useStyles();
  // Handle sheet.
  const handleOpen = useCallback(() => {
    forceOpenFulfillmentSlotDialog();
  }, []);

  if (!isFulfillmentScheduling) {
    return null;
  }

  return renderBar ? (
    <div className={card ? classes.card : undefined}>
      <FulfillmentSlotSwitcherBar
        fulfillmentSlot={isFulfillmentSlotValid ? fulfillmentSlot : null}
        handleChange={handleOpen}
        standalone={standalone}
        editable={editable}
      />
    </div>
  ) : (
    <FulfillmentSlotSwitcherDefault
      fulfillmentSlot={isFulfillmentSlotValid ? fulfillmentSlot : null}
      handleChange={handleOpen}
      standalone={standalone}
      editable={editable}
    />
  );
};

FulfillmentSlotSwitcher.propTypes = {
  card: PropTypes.bool,
  editable: PropTypes.bool,
  fulfillmentSlot: PropTypes.shape(),
  isFulfillmentScheduling: PropTypes.bool,
  isFulfillmentSlotValid: PropTypes.bool,
  renderBar: PropTypes.bool,
  standalone: PropTypes.bool,
};
FulfillmentSlotSwitcher.defaultProps = {
  isFulfillmentScheduling: false,
  fulfillmentSlot: null,
  renderBar: false,
  editable: true,
  card: false,
  standalone: false,
  isFulfillmentSlotValid: true,
};

export default connect(FulfillmentSlotSwitcher);
