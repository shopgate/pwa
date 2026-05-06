import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const useStyles = makeStyles()(theme => ({
  error: {
    position: 'absolute',
    bottom: 2,
    fontSize: 12,
    lineHeight: '14px',
    color: theme.palette.error.main,
    ...ellipsisLine,
  },
}));

/**
 * Error message component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ErrorText = ({
  elementName, validationError, errorText, ariaHidden, translate, className,
}) => {
  const { classes, cx } = useStyles();

  return (
    <div
      id={`ariaError-${elementName}`}
      className={cx(classes.error, className, 'errorText')}
      aria-live="assertive"
      aria-atomic="true"
      aria-hidden={ariaHidden}
    >
      {translate && <I18n.Text string={validationError || errorText} />}
      {!translate && (validationError || errorText)}
    </div>
  );
};

ErrorText.propTypes = {
  ariaHidden: PropTypes.bool,
  className: PropTypes.string,
  elementName: PropTypes.string,
  errorText: PropTypes.string,
  translate: PropTypes.bool,
  validationError: PropTypes.string,
};

ErrorText.defaultProps = {
  className: '',
  errorText: null,
  elementName: null,
  translate: true,
  ariaHidden: false,
  validationError: null,
};

export default ErrorText;
