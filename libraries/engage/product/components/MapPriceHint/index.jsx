import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import {
  SurroundPortals,
  I18n,
  TimeBoundary,
} from '@shopgate/engage/components';
import { isBeta, useWidgetSettings, useWidgetStyles } from '@shopgate/engage/core';
import { PRODUCT_MAP_PRICE } from '@shopgate/engage/product';
import { showHint } from './helpers';
import connect from './connector';

const defaultStyle = css({
  fontSize: '0.75rem',
}).toString();

/**
 * The Product Map Price Hint component.
 * @return {JSX}
 */
const MapPriceHint = ({ price, mapPrice }) => {
  if (!isBeta()) {
    return null;
  }

  const settings = useWidgetSettings('@shopgate/engage/product/MapPrice');
  if (!settings.showHint || !settings.hint) {
    return null;
  }

  const styles = useWidgetStyles('@shopgate/engage/product/MapPrice');

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
              className={classNames(defaultStyle, css(styles.hint).toString())}
            />
          )}
        </TimeBoundary>
      }
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
