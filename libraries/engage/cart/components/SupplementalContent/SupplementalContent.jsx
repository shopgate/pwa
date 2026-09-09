import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './SupplementalContent.connector';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'block',
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
      color: theme.palette.primary.main,
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

  return (
    <Typography
      variant="caption"
      component="div"
      color="textSecondary"
      className={cx(classes.wrapper, className)}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
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
