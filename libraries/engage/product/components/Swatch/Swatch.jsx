import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { useWidgetStyles } from '../../../core';
import SwatchContent from './SwatchContent';

export const WIDGET_ID = '@shopgate/engage/product/Swatch';

const useStyles = makeStyles()((_, {
  swatchStyle,
  itemStyle,
  itemSelectedStyle,
}) => ({
  swatch: swatchStyle || {},
  item: itemStyle || {},
  itemSelected: itemSelectedStyle || {},
}));

/**
 * The swatch component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Swatch = ({ swatch }) => {
  const styles = useWidgetStyles(WIDGET_ID);
  const { classes } = useStyles({
    swatchStyle: styles?.swatch,
    itemStyle: styles?.item,
    itemSelectedStyle: styles?.itemSelected,
  });

  if (!swatch) {
    return null;
  }

  const classNames = {
    swatch: classes.swatch,
    item: classes.item,
    itemSelected: classes.itemSelected,
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
