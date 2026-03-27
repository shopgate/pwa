import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    bottom: 2,
    color: theme.palette.error.main,
    fontSize: 12,
    lineHeight: '14px',
    overflow: 'hidden',
    position: 'absolute',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
}));

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
    <div
      id={`ariaError-${elementName}`}
      className={cx(className, classes.root, 'errorText')}
      aria-live="assertive"
      aria-atomic="true"
      aria-hidden={ariaHidden}
    >
      {translate && <I18n.Text string={errorText} />}
      {!translate && errorText}
    </div>
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
