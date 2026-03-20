import React, { useContext } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables, themeColors } from '@shopgate/pwa-common/helpers/config';
import { Accordion } from '../../../components';
import { StoreContext } from './Store.context';
import { StoreOpeningHours } from './StoreOpeningHours';
import { StoreAddress } from './StoreAddress';
import { StorePhoneNumber } from './StorePhoneNumber';
import { StoreAddressShort } from './StoreAddressShort';

const { gap } = themeVariables;
const baseCardPadding = `${gap.small}px ${gap.big}px`;

const useStyles = makeStyles()({
  storeDetailsBody: {
    padding: baseCardPadding,
    borderTop: `1px solid ${themeColors.shade7}`,
  },
  storeDetailsAccordion: {
    justifyContent: 'space-between',
  },
});

/**
 * Renders a single store details.
 * @returns {JSX}
 */
export function StoreDetails() {
  const { classes } = useStyles();
  const store = useContext(StoreContext);

  if (!store) {
    return null;
  }

  return (
    <Accordion
      className={classes.storeDetailsAccordion}
      renderLabel={() => (
        <StoreAddress address={store.address} />
      )}
      contentClassName={classes.storeDetailsBody}
    >
      <StoreOpeningHours hours={store.operationHours} />
      {store.address && <StorePhoneNumber phone={store.address.phoneNumber} />}
      <StoreAddressShort showFull address={store.address} />
    </Accordion>
  );
}
