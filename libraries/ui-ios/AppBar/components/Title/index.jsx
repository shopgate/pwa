import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    fontSize: 17,
    fontWeight: 600,
    flexGrow: 1,
    lineHeight: '44px',
    left: 90,
    overflow: 'hidden',
    position: 'absolute',
    right: 90,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    top: 0,
    whiteSpace: 'nowrap',
  },
});

/**
 * The AppBarTitle component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const AppBarTitle = ({ title }) => {
  const { classes } = useStyles();

  if (!title) {
    return null;
  }

  return (
    <div
      className={classNames(classes.root, 'theme__app-bar__title')}
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
