import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash/defaultsDeep';
import { css } from 'glamor';
import { PRODUCT_SWATCH } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
import { isBeta, useConfig, useWidgetConfig } from '../../../core';
import SwatchColor from './SwatchColor';
import SwatchTexture from './SwatchTexture';

const { colors = {} } = useConfig();

const widgetDefaults = {
  settings: {
    selectionStyles: {
      selected: {
        borderColor: colors.accent,
      },
      unselected: {
        borderColor: colors.shade4,
      },
    },
    itemWidth: '1.5rem',
    itemHeight: '1.5rem',
  },
  styles: {
    swatch: {
      marginBottom: '0.4rem',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
    },
    item: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 'auto',
      alignSelf: 'auto',
      marginRight: '0.3rem',
      marginBottom: '0.3rem',
      pointerEvents: 'none',
      borderRadius: '50%',
      backgroundSize: 'cover',
      borderWidth: '1px',
      borderStyle: 'solid',
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
  if (!isBeta()) {
    return null;
  }

  // Don't render if no data is set
  if (!swatch) {
    return null;
  }

  const { settings = {}, styles = {} } = useWidgetConfig(widgetId, widgetPath);

  // override default settings with configured widget settings
  const widgetSettings = defaultsDeep(settings, widgetDefaults.settings);
  const widgetStyles = defaultsDeep(styles, widgetDefaults.styles);

  // Pre-compute class names
  const itemClassName = css({
    // Take settings to fill all sizes (overridable)
    minWidth: widgetSettings.itemWidth,
    width: widgetSettings.itemWidth,
    maxWidth: widgetSettings.itemWidth,
    minHeight: widgetSettings.itemHeight,
    height: widgetSettings.itemHeight,
    maxHeight: widgetSettings.itemHeight,
    ...widgetStyles.item,
  }).toString();
  const selectionClassNames = Object.keys(widgetSettings.selectionStyles).reduce((result, key) => ({
    ...result,
    [key]: css(widgetSettings.selectionStyles[key]).toString(),
  }), {});

  return (
    <SurroundPortals portalName={PRODUCT_SWATCH} portalProps={{ swatch }}>
      <ul data-test-id={testId} className={css(widgetStyles.swatch).toString()}>
        {swatch.values.map(value => (
          <Fragment key={value.id}>
            { !value.swatch.imageUrl && value.swatch.color && (
              <SwatchColor
                testId={`${testId}.item.${value.id}`}
                className={`${itemClassName} ${selectionClassNames.unselected}`}
                color={value.swatch.color}
              />
            ) }
            { value.swatch.imageUrl && !value.swatch.color && (
              <SwatchTexture
                testId={`${testId}.item.${value.id}`}
                className={`${itemClassName} ${selectionClassNames.unselected}`}
                imageUrl={value.swatch.imageUrl}
              />
            ) }
          </Fragment>
        ))}
      </ul>
    </SurroundPortals>
  );
};

Swatch.propTypes = {
  testId: PropTypes.string.isRequired,
  swatch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    swatch: PropTypes.bool,
    values: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      swatch: PropTypes.shape({
        // Contains only imageUrl or color, never both
        imageUrl: PropTypes.string,
        color: PropTypes.string,
      }).isRequired,
    })).isRequired,
  }),
  widgetPath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Swatch.defaultProps = {
  swatch: null,
  widgetPath: undefined,
};

export default Swatch;
