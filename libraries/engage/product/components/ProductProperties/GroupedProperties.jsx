import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/pwa-ui-material';
import { i18n } from '@shopgate/engage/core';
import Lists from './Lists';
import ListsHTML from './ListsHTML';
import Wrapper from './Wrapper';
import { accordion } from './style';

/**
 * Renders the properties as groups.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const GroupedProperties = ({ groups }) => groups
  .map(group => (
    <div key={group.key} className={accordion}>
      <Accordion
        renderLabel={() => group.label || i18n.text(`product.displayGroups.${group.key}`)}
        testId={`product-properties-group-${!group.label ? group.key : `${group.key}-${group.label}`}`}
      >
        <Wrapper dense groupName={group.label || group.key} htmlOnly={group.htmlOnly}>
          {group.htmlOnly ? (
            <ListsHTML properties={group.properties} />
          ) : (
            <Lists properties={group.properties} />
          )}
        </Wrapper>
      </Accordion>
    </div>
  ));

GroupedProperties.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default GroupedProperties;
