import React, { useContext, forwardRef } from 'react';
import { CardList } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { StoreFinderContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import StoreFinderLocation from './StoreFinderLocation';

const { colors, variables } = themeConfig;
const gapM = variables.gap.small + variables.gap.xsmall;

const useStyles = makeStyles()({
  container: {
    paddingTop: 2,
    borderTop: 'none',
    overflowY: 'unset',
    WebkitOverflowScrolling: 'unset',
  },
  cardList: {
    paddingTop: 0,
  },
  card: {
    background: colors.light,
    border: `1px solid ${colors.shade7}`,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
    borderRadius: 3,
    ':not(:last-child)': {
      marginBottom: gapM,
    },
  },
});

/**
 * @param {Object} props The component props
 * @param {Object} ref A forwarded ref
 * @returns {JSX}
 */
const StoreFinderLocations = (props, ref) => {
  const { classes } = useStyles();
  const { locations } = useContext(StoreFinderContext);

  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className={classes.container}>
      <CardList className={classes.cardList}>
        {locations.map(location => (
          <CardList.Item className={classes.card} key={location.code}>
            <StoreContext.Provider value={location}>
              <StoreFinderLocation />
            </StoreContext.Provider>
          </CardList.Item>
        ))}
      </CardList>
    </div>
  );
};

export default forwardRef(StoreFinderLocations);
