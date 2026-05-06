import React from 'react';
import PropTypes from 'prop-types';
import {
  SurroundPortals,
  I18n,
  TimeBoundary,
} from '@shopgate/engage/components';
import { isBeta, useWidgetSettings, useWidgetStyles } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { PRODUCT_MAP_PRICE } from '@shopgate/engage/product';
import { showHint } from './helpers';
import connect from './connector';

const useStyles = makeStyles()((_, { hintStyle }) => ({
  defaultStyle: {
    fontSize: '0.75rem',
  },
  hintStyle: hintStyle || {},
}));

/**
 * The Product Map Price Hint component.
 * @return {JSX}
 */
const MapPriceHint = ({ price, mapPrice }) => {
  const styles = useWidgetStyles('@shopgate/engage/product/MapPrice');
  const settings = useWidgetSettings('@shopgate/engage/product/MapPrice');
  const { classes, cx } = useStyles({ hintStyle: styles?.hint });

  if (!settings.showHint || !settings.hint) {
    return null;
  }

  if (!isBeta()) {
    return null;
  }

  return (
    <SurroundPortals portalName={PRODUCT_MAP_PRICE}>
      {showHint(price, mapPrice) &&
        <TimeBoundary
          start={new Date(mapPrice.startDate)}
          end={new Date(mapPrice.endDate)}
        >
          {({ between }) => (
            between &&
            <I18n.Text
              string={settings.hint}
              className={cx('engage__product__map-price-hint', cx(classes.defaultStyle, classes.hintStyle))}
            />
          )}
        </TimeBoundary>}
    </SurroundPortals>
  );
};

MapPriceHint.propTypes = {
  mapPrice: PropTypes.shape(),
  price: PropTypes.shape(),
};

MapPriceHint.defaultProps = {
  mapPrice: null,
  price: null,
};

export default connect(MapPriceHint);
