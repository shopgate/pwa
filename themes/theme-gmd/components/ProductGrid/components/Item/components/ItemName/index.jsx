import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { PRODUCT_ITEM_NAME } from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { ProductName } from '@shopgate/engage/product';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  name: {
    fontWeight: '500',
    lineHeight: 1.15,
    marginTop: 1,
    wordBreak: ['keep-all', 'break-word'],
    hyphens: 'auto',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontSize: '1.125rem',
      marginTop: 0,
    },
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      fontSize: '1.25rem',
    },
  },
});

/**
 * The item name component.
 * @param {Object} props The component props.
 * @returns {JSX|null}
 */
const ItemName = ({ display, productId, name }) => {
  const { classes, cx } = useStyles();

  if (display && !display.name) {
    return null;
  }

  const portalProps = { productId };

  return (
    <ProductName
      name={name}
      className={cx(classes.name, 'theme__product-grid__item__item-name')}
      portalName={PRODUCT_ITEM_NAME}
      portalProps={portalProps}
      testId={`Productname: ${name}`}
    />
  );
};

ItemName.propTypes = {
  productId: PropTypes.string.isRequired,
  display: PropTypes.shape(),
  name: PropTypes.string,
};

ItemName.defaultProps = {
  display: null,
  name: null,
};

export default memo(ItemName);
