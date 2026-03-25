import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    color: themeColors.shade11,
    fontSize: '0.875rem',
    fontWeight: 500,
    margin: '16px 0 0 16px',
  },
});

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
    <div className={classes.root}>
      <I18n.Text string={text} />
    </div>
  );
};

NavDrawerTitle.propTypes = {
  text: PropTypes.string,
};

NavDrawerTitle.defaultProps = {
  text: '',
};

export default NavDrawerTitle;
