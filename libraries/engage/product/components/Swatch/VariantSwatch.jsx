import React, { memo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { css } from '@shopgate/engage/styles';
import { useWidgetStyles } from '../../../core';
import SwatchContent from './SwatchContent';

const WIDGET_ID = '@shopgate/engage/product/VariantSwatch';

/**
 * The variant swatch component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const VariantSwatch = ({ swatch, onClick }) => {
  const styles = useWidgetStyles(WIDGET_ID);

  if (!swatch) {
    return null;
  }

  const classNames = {
    swatch: styles && styles.swatch ? css(styles.swatch) : null,
    item: styles && styles.item ? css(styles.item) : null,
    itemSelected: styles && styles.itemSelected ? css(styles.itemSelected) : null,
  };

  return (
    <SwatchContent swatch={swatch} classNames={classNames} onClick={onClick} />
  );
};

VariantSwatch.propTypes = {
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
};

VariantSwatch.defaultProps = {
  swatch: null,
  onClick: noop,
};

export default memo(VariantSwatch);
