import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  subgroup: {
    paddingTop: theme.spacing(1),
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}));

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
        <Typography
          variant="caption"
          component="span"
          dangerouslySetInnerHTML={{ __html: group }}
        />
      </td>
    </tr>
  );
};

Group.propTypes = {
  group: PropTypes.string.isRequired,
};

export default React.memo(Group);
