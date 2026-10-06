import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import htmlToText from '@shopgate/pwa-common/helpers/html/htmlToText';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2, 2, 1),
  },
}));

/**
 * The page title of the modern header style, shown above the content instead of in the bar.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const Headline = ({ title }) => {
  const { classes, cx } = useStyles();
  const text = useMemo(() => htmlToText(title || ''), [title]);

  if (!text) {
    return null;
  }

  return (
    <Typography
      variant="h2"
      component="h1"
      className={cx(classes.root, 'theme__app-bar__headline')}
    >
      {text}
    </Typography>
  );
};

Headline.propTypes = {
  title: PropTypes.string,
};

Headline.defaultProps = {
  title: '',
};

export default Headline;
