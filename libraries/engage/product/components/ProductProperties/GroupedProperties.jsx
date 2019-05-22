import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/pwa-ui-material';
import Lists from './Lists';
import Wrapper from './Wrapper';
import { accordion } from './style';

/**
 * Renders the properties as groups.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const GroupedProperties = ({ properties, groups }) => groups
  .map(group => (
    <div key={group} className={accordion}>
      <Accordion renderLabel={() => group} testId={`product-properties-group-${group}`}>
        <Wrapper dense>
          <Lists
            properties={properties.filter(property => property.displayGroup === group)}
          />
        </Wrapper>
      </Accordion>
    </div>
  ));

GroupedProperties.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default GroupedProperties;
