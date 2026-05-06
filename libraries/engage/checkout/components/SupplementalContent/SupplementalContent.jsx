import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './SupplementalContent.connector';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'block',
    color: theme.palette.text.secondary,
    fontSize: 12,
    lineHeight: 'unset',
    padding: theme.spacing(2, 0),
    '> *:first-child/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */': {
      marginTop: 0,
    },
    ' ol, ul': {
      margin: theme.spacing(1, 0),
      paddingLeft: theme.spacing(4),
    },
    ' ol': {
      listStyle: 'decimal',
    },
    ' ul': {
      listStyle: 'disc',
    },
    ' a': {
      textDecoration: 'underline',
      color: 'var(--color-primary)',
    },
  },
}));

/**
 * The SupplementalContent component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const SupplementalContent = ({ text, className }) => {
  const { classes, cx } = useStyles();
  if (!text) {
    return null;
  }

  /* eslint-disable react/no-danger */
  return (
    <div
      className={cx(classes.wrapper, className)}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
  /* eslint-enable react/no-danger */
};

SupplementalContent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};

SupplementalContent.defaultProps = {
  text: null,
  className: null,
};

export default connect(SupplementalContent);
