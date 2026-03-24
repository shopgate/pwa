import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  root: {
    background: colors.background,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
});

/**
 * The SuggestionsBackdrop component.
 * @return {JSX}
 */
const SuggestionsBackdrop = ({ onClick }) => {
  const { classes } = useStyles();
  return <div aria-hidden className={classes.root} onClick={onClick} />;
};

SuggestionsBackdrop.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SuggestionsBackdrop;
