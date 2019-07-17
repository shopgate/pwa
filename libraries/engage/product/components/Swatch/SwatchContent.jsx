import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import cls from 'classnames';
import { PRODUCT_SWATCH } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
import SwatchColor from './SwatchColor';
import SwatchTexture from './SwatchTexture';
import { swatchClass, itemClass, itemSelectedClass } from './style';

/**
 * The swatch content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SwatchContent = ({ swatch, classNames, onClick }) => {
  if (!swatch) {
    return null;
  }

  return (
    <SurroundPortals portalName={PRODUCT_SWATCH} portalProps={{ swatch }}>
      <ul className={cls(swatchClass, {
          [classNames.swatch]: !!classNames.swatch,
        })}
      >
        {swatch.values.map((value) => {
          if (value.swatch.color) {
            return (
              <SwatchColor
                key={value.id}
                valueId={value.id}
                color={value.swatch.color}
                onClick={onClick}
                className={cls(itemClass, {
                  [classNames.item]: !!classNames.item,
                  [itemSelectedClass]: !!value.selected,
                  [classNames.itemSelected]: !!value.selected,
                })}
              />
            );
          }
          if (value.swatch.imageUrl) {
            return (
              <SwatchTexture
                key={value.id}
                valueId={value.id}
                imageUrl={value.swatch.imageUrl}
                onClick={onClick}
                className={cls({
                  [classNames.item]: !!classNames.item,
                  [itemSelectedClass]: !!value.selected,
                  [classNames.itemSelected]: !!value.selected,
                })}
              />
            );
          }
          return null;
        })}
      </ul>
    </SurroundPortals>
  );
};

SwatchContent.propTypes = {
  classNames: PropTypes.shape({
    swatch: PropTypes.string,
    item: PropTypes.string,
    itemSelected: PropTypes.string,
  }),
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

SwatchContent.defaultProps = {
  classNames: {},
  swatch: null,
  onClick: noop,
};

export default SwatchContent;
