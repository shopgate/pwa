import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const useStyles = makeStyles()(theme => ({
  label: {
    position: 'absolute',
    left: 0,
    top: 24,
    lineHeight: '19px',
    pointerEvents: 'none',
    userSelect: 'none',
    color: themeConfig.colors.shade12,
    transformOrigin: 'left top 0px',
    willChange: 'transform, color',
    overflow: 'visible',
    transition: `transform ${easing}, color ${easing}`,
    ...ellipsisLine,
  },
  labelStatic: {
    opacity: 1,
    lineHeight: '19px',
    pointerEvents: 'none',
    userSelect: 'none',
    color: themeConfig.colors.shade12,
  },
  labelFloating: {
    transform: 'translate3d(0, -22px, 0) scale3d(0.75, 0.75, 0.75)',
    opacity: 1,
  },
  labelRegular: {
    opacity: 0,
  },
  labelError: {
    color: theme.palette.error.main,
  },
}));

/**
 * Renders the label element.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Label = ({
  hasErrorMessage, htmlFor, isFloating, isFocused, label, labelStatic,
}) => {
  const { classes, cx } = useStyles();

  return (
    /* eslint-disable-next-line jsx-a11y/label-has-associated-control */
    <label
      htmlFor={htmlFor}
      className={cx(
        {
          [classes.label]: !labelStatic,
          [classes.labelStatic]: labelStatic,
          [classes.labelFloating]: isFloating,
          // Hide label only when placeholder is shown (empty + blurred). When floating or
          // static, never apply opacity: 0 — JSS rule order differs from glamor injection order.
          [classes.labelRegular]:
            !labelStatic && !isFloating && !isFocused,
          [classes.labelError]: hasErrorMessage && isFocused,
        },
        'label',
        {
          floating: isFloating,
        }
      )}
    >
      <I18n.Text string={label} />
    </label>
  );
};

Label.propTypes = {
  hasErrorMessage: PropTypes.bool,
  htmlFor: PropTypes.string,
  isFloating: PropTypes.bool,
  isFocused: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  labelStatic: PropTypes.bool,
};

Label.defaultProps = {
  htmlFor: '',
  isFocused: false,
  isFloating: false,
  hasErrorMessage: false,
  label: '',
  labelStatic: false,
};

export default Label;
