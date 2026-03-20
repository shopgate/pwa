import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '@shopgate/engage/core/helpers';
import { IN_STORE_PICKUP_BOPIS_LABEL } from '../../constants';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

const useStyles = makeStyles()({
  itemRowDisabled: {
    opacity: 0.3,
  },
});

/**
 * Renders the FulfillmentSelectorBOPIS components.
 * @returns {JSX.Element}
 */
export const FulfillmentSelectorBOPIS = () => {
  const { classes } = useStyles();
  const { isBOPISEnabled, isReady } = useFulfillmentSelectorState();
  const className = classNames({
    [classes.itemRowDisabled]: !isReady || !isBOPISEnabled,
  });

  return (
    <div className={className}>
      {i18n.text(IN_STORE_PICKUP_BOPIS_LABEL)}
    </div>
  );
};
