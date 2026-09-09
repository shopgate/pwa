import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  body: {
    color: theme.palette.common.black,
    flexGrow: 1,
    overflow: 'auto',
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Content = ({ content }) => {
  const { classes } = useStyles();

  if (!content) {
    return null;
  }

  return (
    <Typography variant="body2" component="div" align="center" className={classes.body} id="basicDialogDesc">
      {content}
    </Typography>
  );
};

Content.propTypes = {
  content: PropTypes.node,
};

Content.defaultProps = {
  content: null,
};

export default memo(Content);
