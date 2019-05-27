import React from 'react';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash/defaultsDeep';
import { css } from 'glamor';
import { PRODUCT_SWATCH } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
import { useConfig, useWidgetConfig } from '../../../core';
import Element from './Element';

const { colors = {} } = useConfig();

const widgetDefaults = {
  settings: {
    selectionSettings: {
      selected: {
        boxShadow: `inset 0 0 0 1px ${colors.accent}`,
      },
      unselected: {
        boxShadow: `inset 0 0 0 1px ${colors.shade4}`,
      },
    },
    elementWidth: '0.8rem',
    elementHeight: '0.8rem',
  },
  styles: {
    swatch: {
      marginBottom: '0.2rem',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
    },
    element: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 'auto',
      alignSelf: 'auto',
      marginRight: '0.2rem',
      marginBottom: '0.2rem',
      pointerEvents: 'none',
      padding: '1px',
      borderRadius: '50%',
    },
    colorField: {
      borderRadius: '50%',
    },
    textureField: {
      borderRadius: '50%',
      backgroundSize: 'cover',
    },
  },
};

const widgetId = '@shopgate/engage/product/Swatch';

/**
 * The swatch component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Swatch = ({ testId, swatch, widgetPath }) => {
  const { settings = {}, styles = {} } = useWidgetConfig(widgetId, widgetPath);

  // override default settings with configured widget settings
  const widgetSettings = defaultsDeep(settings, widgetDefaults.settings);
  const widgetStyles = defaultsDeep(styles, widgetDefaults.styles);

  return (
    <SurroundPortals portalName={PRODUCT_SWATCH} portalProps={{ swatch }}>
      <ul data-test-id={testId} className={css(widgetStyles.swatch).toString()}>
        {swatch.values.map(value => (
          <Element
            key={value.id}
            testId={`${testId}.element.${value.id}`}
            style={{
              // Take settings to fill all sizes (overridable)
              minWidth: widgetSettings.elementWidth,
              width: widgetSettings.elementWidth,
              maxWidth: widgetSettings.elementWidth,
              minHeight: widgetSettings.elementHeight,
              height: widgetSettings.elementHeight,
              maxHeight: widgetSettings.elementHeight,
              ...widgetStyles.element,
            }}
            colorFieldStyle={widgetStyles.colorField}
            textureFieldStyle={widgetStyles.textureField}
            field={value.swatch}
            selectionSettings={widgetSettings.selectionSettings}
          />
        ))}
      </ul>
    </SurroundPortals>
  );
};

Swatch.propTypes = {
  swatch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    swatch: PropTypes.bool,
    values: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      swatch: PropTypes.shape().isRequired,
    })).isRequired,
  }).isRequired,
  testId: PropTypes.string.isRequired,
  widgetPath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Swatch.defaultProps = {
  widgetPath: undefined,
};

export default Swatch;
