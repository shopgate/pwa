import React, { useContext } from 'react';
import { CardList, SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import { FulfillmentContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import { StoreCard } from './StoreCard';
import { FULFILLMENT_SHEET_STORE_LIST } from '../../constants/Portals';

const useStyles = makeStyles()(theme => ({
  stores: {
    background: 'var(--color-background-accent)',
    padding: theme.spacing(1.5, 1.5, 2),
    fontSize: '0.875rem',
    boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
  },
  storeCard: {
    background: themeColors.light,
    marginBottom: theme.spacing(1.5),
    ':last-of-type': {
      marginBottom: 0,
    },
    border: `1px solid ${themeColors.shade7}`,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
    borderRadius: '0px 0px 3px 3px',
  },
  storeCardPlaceholder: {
    margin: '10px 0',
    height: 36,
  },
}));

/**
 * Renders the locations.
 * @returns {JSX.Element}
 */
function StoreListLocations() {
  const { classes } = useStyles();
  const { locations, isLoading } = useContext(FulfillmentContext);

  if (!isLoading && (!locations || locations.length === 0)) {
    return null;
  }

  const showPlaceholder = isLoading && (!locations || locations.length === 0);

  return (
    <SurroundPortals
      portalName={FULFILLMENT_SHEET_STORE_LIST}
      portalProps={{ locations }}
    >
      <CardList className={classes.stores}>
        <PlaceholderLabel className={classes.storeCardPlaceholder} ready={!showPlaceholder}>
          {locations.map(location => (
            <CardList.Item className={classes.storeCard} key={location.code}>
              <StoreContext.Provider value={location}>
                <StoreCard />
              </StoreContext.Provider>
            </CardList.Item>
          ))}
        </PlaceholderLabel>
      </CardList>
    </SurroundPortals>
  );
}

export default StoreListLocations;
