import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { useWidgetStyles } from '../../../core';
import SwatchContent from './SwatchContent';

export const WIDGET_ID = '@shopgate/engage/product/Swatch';

/**
 * The swatch component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Swatch = ({ swatch }) => {
  if (!swatch) {
    return null;
  }

  const styles = useWidgetStyles(WIDGET_ID);

  const classNames = {
    swatch: styles && styles.swatch ? css(styles.swatch).toString() : null,
    item: styles && styles.item ? css(styles.item).toString() : null,
    itemSelected: styles && styles.itemSelected ? css(styles.itemSelected).toString() : null,
  };

  return (
    <SwatchContent swatch={swatch} classNames={classNames} />
  );
};

Swatch.propTypes = {
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
};

Swatch.defaultProps = {
  swatch: null,
};

export default memo(Swatch);
