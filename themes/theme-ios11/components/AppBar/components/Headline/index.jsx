import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import htmlToText from '@shopgate/pwa-common/helpers/html/htmlToText';

const useStyles = makeStyles()(theme => ({
  root: {
    background: theme.components.appBar.background,
    color: theme.components.appBar.color,
  },
  text: {
    margin: 0,
    padding: theme.spacing(1.5, 2),
  },
}));

/**
 * The page title of the modern header style. It continues the header above the content.
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
    <div className={cx(classes.root, 'theme__app-bar__headline')}>
      <Typography
        variant="h1"
        component="h1"
        className={cx(classes.text, 'headline', 'theme__headline')}
      >
        {text}
      </Typography>
    </div>
  );
};

Headline.propTypes = {
  title: PropTypes.string,
};

Headline.defaultProps = {
  title: '',
};

export default Headline;
