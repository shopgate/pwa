import React from 'react';
import { css } from 'glamor';
import { connect } from 'react-redux';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import PropTypes from 'prop-types';
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

const styles = {
  wrapper: css({
    flexDirection: 'row',
    alignItems: 'flex-end',
    fontSize: '0.65rem',
  }),
  text: css({
    margin: '0 !important',

  }).toString(),
  location: css({
    marginLeft: '0 !important',
  }),
};

/**
 * Renders visible stock information based on the given location.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const StockInfoLists = ({
  preferredLocation, product, inventory, showStockInfo,
}) => {
  if (!showStockInfo || !preferredLocation) {
    return null;
  }

  const portalProps = {
    inventory,
    location: preferredLocation,
    product,
  };

  return (
    <SurroundPortals portalName={PRODUCT_LOCATION_STOCK_INFO_LIST} portalProps={portalProps}>
      <div className={styles.wrapper}>
        <PlaceholderLabel ready={!!inventory}>
          <StockInfo product={product} location={preferredLocation} />
          {' '}
          <I18n.Text
            string="locations.stock_info.pick_up_at"
            params={{ storeName: '' }}
            className={styles.text}
          />
          {' '}
          <span className={styles.location}>{preferredLocation.name}</span>
        </PlaceholderLabel>
      </div>
    </SurroundPortals>
  );
};

StockInfoLists.propTypes = {
  inventory: PropTypes.shape().isRequired,
  preferredLocation: PropTypes.shape().isRequired,
  product: PropTypes.shape().isRequired,
  showStockInfo: PropTypes.bool.isRequired,
};

StockInfoLists.defaultProps = {
};

export default connect(makeMapStateToProps)(StockInfoLists);
