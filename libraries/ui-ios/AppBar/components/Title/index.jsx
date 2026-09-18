import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import htmlToText from '@shopgate/pwa-common/helpers/html/htmlToText';

const useStyles = makeStyles()({
  root: {
    flexGrow: 1,
    lineHeight: '44px',
    left: 90,
    position: 'absolute',
    right: 90,
    top: 0,
  },
});

/**
 * The AppBarTitle component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const AppBarTitle = ({ title }) => {
  const { classes, cx } = useStyles();
  // Titles can contain HTML entities (e.g. product names). They are decoded to plain text, since
  // titles might originate from untrusted sources like URL parameters and must not render as HTML.
  const text = useMemo(() => htmlToText(title), [title]);

  if (!text) {
    return null;
  }

  return (
    <Typography
      variant="h4"
      component="div"
      noWrap
      align="center"
      fontWeight="bold"
      className={cx(classes.root, 'theme__app-bar__title')}
      role="heading"
      aria-level="1"
      aria-live="polite"
      tabIndex={-1}
      data-test-id={`title: ${text}`}
    >
      {text}
    </Typography>
  );
};

AppBarTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AppBarTitle;
