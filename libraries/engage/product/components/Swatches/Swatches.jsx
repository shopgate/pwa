import React from 'react';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash/defaultsDeep';
import { css } from 'glamor';
import { PRODUCT_SWATCHES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
import { isBeta, useConfig, useWidgetConfig } from '../../../core';
import { Swatch } from '../Swatch';
import connect from './connector';

const { typography = {} } = useConfig();

const widgetDefaults = {
  settings: {
    // Filters out all swatches which are not in the list, no filter = [] => show all
    maxItemCount: 10,
    filter: [],
  },
  styles: {
    swatches: {
      lineHeight: typography.lineHeight,
    },
  },
};

const widgetId = '@shopgate/engage/product/Swatches';

/**
 * Renders only product swatches from a list of characteristics.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SwatchesUnwrapped = ({ productId, characteristics, widgetPath }) => {
  if (!isBeta()) {
    return null;
  }

  if (!characteristics) {
    return null;
  }

  const { settings = {}, styles = {} } = useWidgetConfig(widgetId, widgetPath);

  // override default settings with configured widget settings
  const widgetSettings = defaultsDeep(settings, widgetDefaults.settings);
  const widgetStyles = defaultsDeep(styles, widgetDefaults.styles);

  const testId = `productSwatches.${productId}`;
  return (
    <SurroundPortals portalName={PRODUCT_SWATCHES} portalProps={{ characteristics }}>
      { widgetSettings.maxItemCount > 0 && (
        <div data-test-id={testId} className={css(widgetStyles.swatches).toString()}>
          {characteristics.filter(c => c.swatch === true).filter((c) => {
            if (widgetSettings.filter.length <= 0) {
              return true;
            }

            // Check if current id is whitelisted by settings
            return !!widgetSettings.filter.find(id => id === c.id);
          }).map(swatch => (
            <Swatch
              key={`${productId}.${swatch.id}`}
              testId={`${testId}.swatch.${swatch.id}`}
              swatch={swatch}
              maxItemCount={widgetSettings.maxItemCount}
            />
          ))}
        </div>
      )}
    </SurroundPortals>
  );
};

SwatchesUnwrapped.propTypes = {
  productId: PropTypes.string.isRequired,
  characteristics: PropTypes.arrayOf(PropTypes.shape()),
  widgetPath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

SwatchesUnwrapped.defaultProps = {
  characteristics: null,
  widgetPath: undefined,
};

SwatchesUnwrapped.displayName = 'Swatches';

export const Swatches = connect(SwatchesUnwrapped);
