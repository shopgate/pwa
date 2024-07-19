import React from 'react';
import PropTypes from 'prop-types';
import { PRODUCT_PROPERTIES } from '@shopgate/engage/product/constants';
import { SurroundPortals } from '@shopgate/engage/components';
import Content from './Content';
import connect from './connector';

/**
 * Renders the product properties.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ProductProperties = ({ properties }) => (
  <SurroundPortals portalName={PRODUCT_PROPERTIES} portalProps={{ properties }}>
    <Content properties={properties} />
  </SurroundPortals>
);

ProductProperties.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductProperties.defaultProps = {
  properties: null,
};

export default connect(ProductProperties);
