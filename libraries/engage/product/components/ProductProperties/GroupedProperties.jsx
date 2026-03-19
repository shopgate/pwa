import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/pwa-ui-material';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Lists from './Lists';
import ListsHTML from './ListsHTML';
import Wrapper from './Wrapper';

const { colors = {} } = themeConfig;

const useStyles = makeStyles()({
  accordion: {
    borderTop: `3px solid ${colors.background}`,
  },
});

/**
 * Renders the properties as groups.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const GroupedProperties = ({ groups }) => {
  const { classes } = useStyles();

  return groups.map(group => (
    <div key={group.key} className={classes.accordion}>
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
};

GroupedProperties.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default GroupedProperties;
