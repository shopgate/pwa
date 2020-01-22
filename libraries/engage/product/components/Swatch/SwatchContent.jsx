import React, { memo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import cls from 'classnames';
import { PRODUCT_SWATCH } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
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
        {swatch.values.map(value => (
          <li
            aria-hidden
            key={value.id}
            onClick={() => onClick(value.id)}
            className={cls(itemClass, {
              [classNames.item]: !!classNames.item,
              [itemSelectedClass]: !!value.selected,
              [classNames.itemSelected]: !!value.selected,
            })}
            style={{
              ...value.swatch.color && { backgroundColor: value.swatch.color },
              ...value.swatch.imageUrl && { backgroundImage: `url(${value.swatch.imageUrl})` },
            }}
          />
        ))}
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

export default memo(SwatchContent);
