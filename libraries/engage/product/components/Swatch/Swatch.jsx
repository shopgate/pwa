import React, { Fragment, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { css } from 'glamor';
import { PRODUCT_SWATCH } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
import { isBeta, useWidgetConfig } from '../../../core';
import { SwatchColor } from './SwatchColor';
import { SwatchTexture } from './SwatchTexture';
import { swatchGrid, itemSelected } from './style';

const widgetId = '@shopgate/engage/product/Swatch';

/**
 * The swatch component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SwatchUnwrapped = ({
  testId, maxItemCount, swatch, widgetPath, onClick,
}) => {
  if (!isBeta()) {
    return null;
  }

  // Don't render if no data is set
  if (!swatch) {
    return null;
  }

  const { styles } = useWidgetConfig(widgetId, widgetPath);

  const swatchClass = styles && styles.swatch ? css(styles.swatch).toString() : null;
  const itemClass = styles && styles.item ? css(styles.item).toString() : null;
  const selectedClass = styles && styles.itemSelected ? css(styles.itemSelected).toString() : null;

  /** Click handler */
  const handleClick = useCallback((event) => {
    const { target: { dataset = {} } } = event || {};
    onClick(dataset.valueId);
  });

  return (
    <SurroundPortals portalName={PRODUCT_SWATCH} portalProps={{ swatch }}>
      <ul
        data-test-id={testId}
        className={classNames(swatchGrid, {
          [swatchClass]: !!swatchClass,
        })}
      >
        {swatch.values.map((value, i) => (
          <Fragment key={value.id}>
            { (maxItemCount === null || maxItemCount > i) && (
              <Fragment>
                {value.swatch.color && (
                  <SwatchColor
                    valueId={value.id}
                    testId={`${testId}.item.${value.id}`}
                    color={value.swatch.color}
                    onClick={handleClick}
                    className={classNames({
                      [itemClass]: !!itemClass,
                      [itemSelected]: !!value.selected && !selectedClass,
                      [selectedClass]: !!value.selected && selectedClass,
                    })}
                  />
                ) }
                {value.swatch.imageUrl && (
                  <SwatchTexture
                    valueId={value.id}
                    testId={`${testId}.item.${value.id}`}
                    imageUrl={value.swatch.imageUrl}
                    onClick={handleClick}
                    className={classNames({
                      [itemClass]: !!itemClass,
                      [itemSelected]: !!value.selected && !selectedClass,
                      [selectedClass]: !!value.selected && selectedClass,
                    })}
                  />
                ) }
              </Fragment>
            ) }
          </Fragment>
        ))}
      </ul>
    </SurroundPortals>
  );
};

SwatchUnwrapped.propTypes = {
  testId: PropTypes.string.isRequired,
  maxItemCount: PropTypes.number,
  onClick: PropTypes.func,
  swatch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
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

SwatchUnwrapped.defaultProps = {
  maxItemCount: null,
  swatch: null,
  widgetPath: undefined,
  onClick: noop,
};

SwatchUnwrapped.displayName = 'Swatch';

export const Swatch = memo(SwatchUnwrapped, isEqual);

Swatch.displayName = `Memo(${SwatchUnwrapped.displayName})`;
