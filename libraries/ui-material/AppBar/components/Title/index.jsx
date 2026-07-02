import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    flexGrow: 1,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
  },
});

/**
 * The AppBarTitle component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const AppBarTitle = ({ onClick, title }) => {
  const { classes, cx } = useStyles();

  if (!title) {
    return null;
  }

  return (
    <Typography
      variant="h3"
      component="div"
      noWrap
      className={cx(classes.root, 'theme__app-bar__title')}
      role="heading"
      aria-labelledby="titleLabel"
      aria-level="1"
      data-test-id={`title: ${title}`}
      tabIndex={-1}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <span role="presentation" onClick={onClick} id="titleLabel" dangerouslySetInnerHTML={{ __html: title }} />
    </Typography>
  );
};

AppBarTitle.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

AppBarTitle.defaultProps = {
  onClick: null,
};

export default AppBarTitle;
