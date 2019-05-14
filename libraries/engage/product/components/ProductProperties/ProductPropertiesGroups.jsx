import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/pwa-ui-material';
import { ProductPropertiesRows } from './ProductPropertiesRows';
import { containerDense, accordion } from './ProductProperties.style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function ProductPropertiesGroups({ properties, groups }) {
  return groups.map(group => (
    <div key={group} className={accordion}>
      <Accordion renderLabel={() => group} testId={`product-properties-group-${group}`}>
        <div className={containerDense}>
          <table>
            <tbody>
              <ProductPropertiesRows
                properties={properties.filter(property => property.displayGroup === group)}
              />
            </tbody>
          </table>
        </div>
      </Accordion>
    </div>
  ));
}

ProductPropertiesGroups.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
