import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash/defaultsDeep';
import { css } from 'glamor';
import { PRODUCT_SWATCHES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
import { isBeta, useConfig, useWidgetConfig } from '../../../core';
import Swatch from '../Swatch';
import connect from './connector';

const { typography = {} } = useConfig();

const widgetDefaults = {
  settings: {
    maxCount: 10,
  },
  styles: {
    container: {
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
const Swatches = ({ productId, characteristics, widgetPath }) => {
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
      { widgetSettings.maxCount > 0 && (
        <div data-test-id={testId} className={css(widgetStyles.container).toString()}>
          {characteristics.filter(c => c.swatch === true).map((swatch, i) => (
            <Fragment key={`${productId}.${swatch.id}`}>
              {widgetSettings.maxCount > i && <Swatch
                testId={`${testId}.swatch.${swatch.id}`}
                swatch={swatch}
              />}
            </Fragment>
          ))}
        </div>
      )}
    </SurroundPortals>
  );
};

Swatches.propTypes = {
  productId: PropTypes.string.isRequired,
  characteristics: PropTypes.arrayOf(PropTypes.shape()),
  widgetPath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Swatches.defaultProps = {
  characteristics: null,
  widgetPath: undefined,
};

export default connect(Swatches);
