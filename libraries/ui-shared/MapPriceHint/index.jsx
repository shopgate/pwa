import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  SurroundPortals,
  I18n,
  TimeBoundary,
} from '@shopgate/engage/components';
import {
  LOCATION_CATEGORY,
  LOCATION_GRID,
  LOCATION_PRODUCT,
  PRODUCT_MAP_PRICE,
} from '@shopgate/engage/product';
import {
  isHintVisiblePLP,
  isHintVisiblePDP,
  isHintVisibleSlider,
  showHint,
  getHint,
} from '@shopgate/pwa-common-commerce/product/helpers/mapPrice';
import connect from './connector';
import styles from './style';

const locationVisibility = {
  [LOCATION_CATEGORY]: isHintVisiblePLP,
  [LOCATION_PRODUCT]: isHintVisiblePDP,
  [LOCATION_GRID]: isHintVisibleSlider,
};

/**
 * The Product Map Price Hint component.
 * @return {JSX}
 */
const MapPriceHint = ({ price, location }) => (
  <SurroundPortals portalName={PRODUCT_MAP_PRICE} portalProps={{ location }}>
    {locationVisibility[location] && showHint(price) &&
      <TimeBoundary
        start={new Date(price.mapPricing.startDate)}
        end={new Date(price.mapPricing.endDate)}
      >
        {({ between }) => (
          between &&
          <I18n.Text
            string={getHint()}
            className={classNames(styles.hint, { [styles[location]]: true })}
          />
        )}
      </TimeBoundary>
    }
  </SurroundPortals>
);

MapPriceHint.propTypes = {
  location: PropTypes.string,
  price: PropTypes.shape(),
};

MapPriceHint.defaultProps = {
  location: null,
  price: null,
};

export default connect(MapPriceHint);
