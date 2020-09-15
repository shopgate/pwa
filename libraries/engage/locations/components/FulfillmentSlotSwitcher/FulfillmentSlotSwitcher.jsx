import React, {
  Fragment, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import FulfillmentSlotSwitcherDefault from './FulfillmentSlotSwitcherDefault';
import FulfillmentSlotSwitcherBar from './FulfillmentSlotSwitcherBar';
import connect from './FulfillmentSlotSwitcher.connector';
import { forceOpenFulfillmentSlotDialog } from './FulfillmentSlotProvider';

const styles = {
  card: css({
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
  }).toString(),
};

/**
 * @returns {JSX}
 */
const FulfillmentSlotSwitcher = ({
  fulfillmentSlot,
  renderBar,
  isFulfillmentScheduling,
  standalone,
  card,
  editable,
}) => {
  // Handle sheet.
  const handleOpen = useCallback(() => {
    forceOpenFulfillmentSlotDialog();
  }, []);

  if (!isFulfillmentScheduling) {
    return null;
  }

  return (
    <Fragment>
      { renderBar ? (
        <div className={card ? styles.card : undefined}>
          <FulfillmentSlotSwitcherBar
            fulfillmentSlot={fulfillmentSlot}
            handleChange={handleOpen}
            standalone={standalone}
          />
        </div>
      ) : (
        <FulfillmentSlotSwitcherDefault
          fulfillmentSlot={fulfillmentSlot}
          handleChange={handleOpen}
          standalone={standalone}
          editable={editable}
        />
      )
      }
    </Fragment>
  );
};

FulfillmentSlotSwitcher.propTypes = {
  card: PropTypes.bool,
  editable: PropTypes.bool,
  fulfillmentSlot: PropTypes.shape(),
  isFulfillmentScheduling: PropTypes.bool,
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
};

export default connect(FulfillmentSlotSwitcher);
