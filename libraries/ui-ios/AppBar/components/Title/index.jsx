import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

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

  if (!title) {
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
      data-test-id={`title: ${title}`}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  );
};

AppBarTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AppBarTitle;
