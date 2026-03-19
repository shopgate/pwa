import React from 'react';
import { connect } from 'react-redux';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { getPreferredLocation, makeGetLocationInventory } from '../../selectors';
import { I18n, SurroundPortals } from '../../../components';
import { StockInfo } from '../StockInfo';
import { PRODUCT_LOCATION_STOCK_INFO_LIST } from '../../constants/Portals';
import { showInventoryInLists } from '../../helpers/showInventoryInLists';

/**
 * Creates a mapper for redux.
 * @returns {Function}
 *
 */
const makeMapStateToProps = () => {
  const getInventory = makeGetLocationInventory(
    (_, props) => getPreferredLocation(_, props)?.code,
    (_, props) => props.productId || props.product?.id
  );
  return (state, props) => ({
    inventory: getInventory(state, props),
    preferredLocation: getPreferredLocation(state, props),
    showStockInfo: showInventoryInLists(state),
  });
};

const useStyles = makeStyles()({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    fontSize: '0.65rem',
  },
  text: {
    margin: '0 !important',

  },
  location: {
    marginLeft: '0 !important',
  },
});

/**
 * Renders visible stock information based on the given location.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const StockInfoLists = ({
  preferredLocation, product, inventory, showStockInfo,
}) => {
  const { classes } = useStyles();
  if (!showStockInfo || !preferredLocation) {
    return null;
  }

  const portalProps = {
    inventory,
    location: preferredLocation,
    product,
  };
  /* eslint-disable jsx-a11y/aria-role */
  return (
    <SurroundPortals portalName={PRODUCT_LOCATION_STOCK_INFO_LIST} portalProps={portalProps}>
      <div className={classes.wrapper} role="text">
        <PlaceholderLabel ready={!!inventory}>
          <StockInfo product={product} location={preferredLocation} />
          {' '}
          <I18n.Text
            string="locations.stock_info.pick_up_at"
            params={{ storeName: '' }}
            className={classes.text}
          />
          {' '}
          <span className={classes.location}>{preferredLocation.name}</span>
        </PlaceholderLabel>
      </div>
    </SurroundPortals>
  );
  /* eslint-enable jsx-a11y/aria-role */
};

StockInfoLists.propTypes = {
  product: PropTypes.shape().isRequired,
  showStockInfo: PropTypes.bool.isRequired,
  inventory: PropTypes.shape(),
  preferredLocation: PropTypes.shape(),
};

StockInfoLists.defaultProps = {
  inventory: null,
  preferredLocation: null,
};

export default connect(makeMapStateToProps)(StockInfoLists);
