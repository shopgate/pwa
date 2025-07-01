import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PRODUCT_ITEM_NAME } from '@shopgate/engage/category/constants';
import { ProductName } from '@shopgate/engage/product';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    fontWeight: '500',
    lineHeight: 1.15,
    marginTop: 1,
    wordBreak: ['keep-all', 'break-word'],
    hyphens: 'auto',
  },
});

/**
 * The item name component.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const ItemName = ({
  display,
  productId,
  name,
}) => {
  const { classes, cx } = useStyles();
  const portalProps = useMemo(() => ({
    productId,
    display,
  }), [display, productId]);

  if (display && !display.name) {
    return null;
  }

  return (
    <ProductName
      name={name}
      className={cx(classes.root, 'theme__product-grid__item__item-name')}
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
