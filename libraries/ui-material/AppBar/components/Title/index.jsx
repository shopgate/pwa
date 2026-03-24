import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    fontSize: 20,
    fontWeight: 500,
    flexGrow: 1,
    lineHeight: '56px',
    overflow: 'hidden',
    padding: '0 16px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

/**
 * The AppBarTitle component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const AppBarTitle = ({ onClick, title }) => {
  const { classes } = useStyles();

  if (!title) {
    return null;
  }

  return (
    <div
      className={classNames(classes.root, 'theme__app-bar__title')}
      role="heading"
      aria-labelledby="titleLabel"
      aria-level="1"
      data-test-id={`title: ${title}`}
      tabIndex={-1}
    >
      <span role="presentation" onClick={onClick} id="titleLabel" dangerouslySetInnerHTML={{ __html: title }} />
    </div>
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
