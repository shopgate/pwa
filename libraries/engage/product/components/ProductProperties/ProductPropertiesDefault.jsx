import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/pwa-common/components';
import { PRODUCT_PROPERTIES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { ProductPropertiesRows } from './ProductPropertiesRows';
import { container } from './ProductProperties.style';
import connect from './ProductPropertiesDefault.connector';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function ProductPropertiesDefaultContainer({ properties }) {
  return (
    <SurroundPortals portalName={PRODUCT_PROPERTIES}>
      {(properties !== null && properties.length !== 0) && (
        <div className={container}>
          <table>
            <tbody>
              <ProductPropertiesRows properties={properties} />
            </tbody>
          </table>
        </div>
      )}
    </SurroundPortals>
  );
}

ProductPropertiesDefaultContainer.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesDefaultContainer.defaultProps = {
  properties: null,
};

export const ProductPropertiesDefault = connect(ProductPropertiesDefaultContainer);
