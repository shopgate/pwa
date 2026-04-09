import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables: { gap } = {} } = themeConfig;

const useStyles = makeStyles()({
  subgroup: {
    paddingTop: gap.small,
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
  },
});

/**
 * Renders a product properties group header.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Group = ({ group }) => {
  const { classes } = useStyles();

  return (
    <tr>
      <td colSpan="2" className={classes.subgroup}>
        {/* eslint-disable-next-line react/no-danger */}
        <span dangerouslySetInnerHTML={{ __html: group }} />
      </td>
    </tr>
  );
};

Group.propTypes = {
  group: PropTypes.string.isRequired,
};

export default React.memo(Group);
