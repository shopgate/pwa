import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    color: theme.palette.grey.dark,
    margin: '16px 0 0 16px',
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavDrawerTitle = ({ text }) => {
  const { classes } = useStyles();

  if (!text.length) {
    return null;
  }

  return (
    <Typography variant="subtitle2" component="div" className={classes.root}>
      <I18n.Text string={text} />
    </Typography>
  );
};

NavDrawerTitle.propTypes = {
  text: PropTypes.string,
};

NavDrawerTitle.defaultProps = {
  text: '',
};

export default NavDrawerTitle;
