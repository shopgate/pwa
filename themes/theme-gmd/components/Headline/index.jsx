import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  root: {
    fontSize: 18,
    padding: `${variables.gap.big}px 0 0`,
    marginTop: 0,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      padding: 0,
      margin: `${variables.gap.big * 2}px 0 ${variables.gap.big}px`,
    },
    textAlign: 'center',
  },
});

/**
 * The headline component.
 * @param {Object} props The component props.
 * @param {string} props.text The text for the headline
 * @returns {JSX}
 */
const Headline = ({ text }) => {
  const { classes } = useStyles();

  return (
    text.length ? <h3 className={`${classes.root} headline theme__headline`}>{text}</h3> : null
  );
};

Headline.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Headline;
