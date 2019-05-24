import React from 'react';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash/defaultsDeep';
import { PRODUCT_SWATCHES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
import { useWidgetConfig } from '../../../core';
import Swatch from './Swatch';
import Element from './Element';
import connect from './connector';

const widgetDefaults = {
  settings: {
    visible: true,
  },
  styles: {
    swatches: {
      fontWeight: '500',
      lineHeight: 1.15,
      marginTop: 1,
      wordBreak: ['keep-all', 'break-word'],
    },
    swatch: {
    },
    element: {
    },
  },
};

const widgetId = '@shopgate/engage/product/Swatches';

/**
 * Renders product swatches.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Swatches = ({ productId, swatches, widgetPath }) => {
  const { settings = {}, styles = {} } = useWidgetConfig(widgetId, widgetPath);

  // override default settings with configured widget settings
  const widgetSettings = defaultsDeep(settings, widgetDefaults.settings);
  const widgetStyles = defaultsDeep(styles, widgetDefaults.styles);

  const testId = `productSwatches.${productId}`;
  return (
    <SurroundPortals portalName={PRODUCT_SWATCHES} portalProps={{ swatches }}>
      { widgetSettings.visible && (
        <div data-test-id={testId} className={widgetStyles.toString()}>
          {/* <pre>Settings:<br />{JSON.stringify(widgetSettings)}</pre>
              <pre>Styles:  <br />{JSON.stringify(widgetStyles)}</pre>
              <pre>Swatches:<br />{JSON.stringify(swatches)}</pre> */}
          {swatches.map(swatch => (
            <Swatch
              key={`${productId}.${swatch.id}`}
              testId={`${testId}.swatch.${swatch.id}`}
              style={widgetStyles.swatch}
            >
              {swatch.values.map(value => (
                <Element
                  key={`${productId}.${swatch.id}.${value.id}`}
                  testId={`${testId}.swatch.${swatch.id}.element.${value.id}`}
                  style={widgetStyles.element}
                  field={value.swatch}
                />
              ))}
            </Swatch>
          ))}
        </div>
      )}
    </SurroundPortals>
  );
};

Swatches.propTypes = {
  productId: PropTypes.string.isRequired,
  swatches: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    swatch: PropTypes.bool,
    values: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      swatch: PropTypes.shape().isRequired,
    })).isRequired,
  })).isRequired,
  widgetPath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Swatches.defaultProps = {
  widgetPath: undefined,
};

export default connect(Swatches);
