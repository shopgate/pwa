import * as React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { Grid } from '@shopgate/engage/components';
import { i18n } from '../../../core';
import { Availability } from '../../../product';
import { DIRECT_SHIP_LABEL, DIRECT_SHIP } from '../../constants';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { FulfillmentSelectorImpossibleError } from './FulfillmentSelectorImpossibleError';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  itemRow: {
    alignContent: 'stretch',
    alignItems: 'baseline',
  },
  itemColumn: {
    display: 'block',
    width: '50%',
    '&:first-of-type': {
      paddingRight: variables.gap.small,
    },
    '&:last-of-type': {
      textAlign: 'right',
    },
  },
  itemRowDisabled: {
    opacity: 0.3,
  },
});

/**
 * Renders the direct ship item label.
 * @returns {JSX.Element}
 */
export const FulfillmentSelectorDirectShip = () => {
  const { classes } = useStyles();
  const {
    productId, selection, isOrderable, isDirectShipEnabled, isReady,
  } = useFulfillmentSelectorState();

  const rowClasses = React.useMemo(() => classNames(classes.itemRow, {
    [classes.itemRowDisabled]: !isReady || !isDirectShipEnabled,
  }), [classes.itemRow, classes.itemRowDisabled, isDirectShipEnabled, isReady]);

  const selected = (selection === DIRECT_SHIP);

  if (selected && !isOrderable) {
    return (
      <>
        <div>
          {i18n.text(DIRECT_SHIP_LABEL)}
        </div>
        <FulfillmentSelectorImpossibleError />
      </>
    );
  }

  return (
    <Grid className={rowClasses} component="div">
      <Grid.Item className={classes.itemColumn} grow={1} shrink={0} component="div">
        {i18n.text(DIRECT_SHIP_LABEL)}
      </Grid.Item>
      <Grid.Item className={classes.itemColumn} grow={1} shrink={0} component="div">
        {isReady && isDirectShipEnabled && isOrderable && (
          <Availability productId={productId} fulfillmentSelection={DIRECT_SHIP} />
        )}
      </Grid.Item>
    </Grid>
  );
};

