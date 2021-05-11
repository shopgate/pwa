import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

/**
 * The ProductProvider component.
 * @return {JSX}
 */
const ProductProvider = ({
  children, productId, provideProduct, product,
}) => {
  useEffect(() => {
    if (!product) {
      provideProduct(productId);
    }
  }, [provideProduct, product, productId]);

  const props = {
    productId,
    product,
  };

  if (typeof children === 'function') {
    return children(props);
  }

  return React.cloneElement(children, {
    ...props,
    ...children.props,
  });
};

ProductProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  productId: PropTypes.string.isRequired,
  provideProduct: PropTypes.func.isRequired,
  product: PropTypes.shape(),
};

ProductProvider.defaultProps = {
  product: null,
};

export default connect(ProductProvider);
