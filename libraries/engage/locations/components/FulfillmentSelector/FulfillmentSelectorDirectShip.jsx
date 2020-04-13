import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Grid } from '@shopgate/engage/components';
import { i18n } from '../../../core';
import { Availability } from '../../../product';
import { DIRECT_SHIP_LABEL, DIRECT_SHIP } from '../../constants';
import { itemRow, itemColumn, itemRowDisabled } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { FulfillmentSelectorImpossibleError } from './FulfillmentSelectorImpossibleError';

/**
 * Renders the direct ship item label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function FulfillmentSelectorDirectShip({ disabled }) {
  const {
    productId, selection, isOrderable, disabled: fulfillmentSelectionDisabled,
  } = useFulfillmentSelectorState();
  const selected = (selection === DIRECT_SHIP);

  if (selected && !isOrderable) {
    return (
      <React.Fragment>
        <div>
          {i18n.text(DIRECT_SHIP_LABEL)}
        </div>
        <FulfillmentSelectorImpossibleError />
      </React.Fragment>
    );
  }

  const rowClasses = React.useMemo(() => classNames(itemRow, {
    [itemRowDisabled.toString()]: disabled,
  }), [disabled]);

  return (
    <Grid className={rowClasses} component="div">
      <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
        {i18n.text(DIRECT_SHIP_LABEL)}
      </Grid.Item>
      <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
        {!fulfillmentSelectionDisabled && isOrderable && (
          <Availability productId={productId} fulfillmentSelection={DIRECT_SHIP} />
        )}
      </Grid.Item>
    </Grid>
  );
}

FulfillmentSelectorDirectShip.defaultProps = {
  disabled: false,
};

FulfillmentSelectorDirectShip.propTypes = {
  disabled: PropTypes.bool,
};
