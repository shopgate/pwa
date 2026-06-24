import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    bottom: 2,
    overflow: 'hidden',
    position: 'absolute',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
});

/**
 * Error message component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ErrorText = ({
  className, errorText, translate, elementName, ariaHidden,
}) => {
  const { classes, cx } = useStyles();

  return (
    <Typography
      variant="caption"
      component="div"
      color="error"
      id={`ariaError-${elementName}`}
      className={cx(classes.root, 'errorText', className)}
      aria-live="assertive"
      aria-atomic="true"
      aria-hidden={ariaHidden}
    >
      {translate && <I18n.Text string={errorText} />}
      {!translate && errorText}
    </Typography>
  );
};

ErrorText.propTypes = {
  ariaHidden: PropTypes.bool,
  className: PropTypes.string,
  elementName: PropTypes.string,
  errorText: PropTypes.string,
  translate: PropTypes.bool,
};

ErrorText.defaultProps = {
  className: null,
  errorText: null,
  elementName: null,
  translate: true,
  ariaHidden: false,
};

export default ErrorText;
