import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { getGroupsFromProperties } from './helpers/getGroupsFromProperties';
import GroupedProperties from './GroupedProperties';
import Wrapper from './Wrapper';
import Rows from './Rows';

const useStyles = makeStyles()(theme => ({
  groupsContainer: {
    borderBottom: `3px solid ${theme.palette.background.default}`,
    marginBottom: theme.spacing(1.5),
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Content = ({ properties }) => {
  const { classes, cx } = useStyles();
  const groups = useMemo(() => getGroupsFromProperties(properties), [properties]);

  if (!properties) {
    return null;
  }

  // Display the simple properties if no groups exist or if not in beta mode.
  if (!isBeta() || !groups || groups.length === 0) {
    return (
      <Wrapper>
        <Rows properties={properties} />
      </Wrapper>
    );
  }

  /*
    This feature is currently in BETA testing.
    It should only be used for approved BETA Client Projects
  */
  return (
    <div className={cx(classes.groupsContainer, 'engage__product__product-properties')}>
      <GroupedProperties groups={groups} />
    </div>
  );
};

Content.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

Content.defaultProps = {
  properties: null,
};

export default Content;
