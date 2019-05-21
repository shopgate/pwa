import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/pwa-ui-material';
import ProductPropertiesLists from './ProductPropertiesLists';
import ProductPropertiesWrapper from './ProductPropertiesWrapper';
import { accordion } from './ProductProperties.style';

/**
 * Renders the properties as groups.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductPropertiesGrouped = ({ properties, groups }) => groups
  .map(group => (
    <div key={group} className={accordion}>
      <Accordion renderLabel={() => group} testId={`product-properties-group-${group}`}>
        <ProductPropertiesWrapper dense>
          <ProductPropertiesLists
            properties={properties.filter(property => property.displayGroup === group)}
          />
        </ProductPropertiesWrapper>
      </Accordion>
    </div>
  ));

ProductPropertiesGrouped.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ProductPropertiesGrouped;
