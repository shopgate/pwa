import React from 'react';
import PropTypes from 'prop-types';
import BaseButton from '@shopgate/pwa-common/components/Button';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const { colors } = themeConfig;

const buttonTypes = [
  'plain',
  'regular',
  'simple',
  'primary',
  'secondary',
];

/**
 * @param {string} text Text color.
 * @param {string|null} background Fill color.
 * @returns {Object} JSS for root button.
 */
const baseButton = (text, background) => ({
  position: 'relative',
  display: 'inline-block',
  outline: 0,
  color: text,
  backgroundColor: background,
  minWidth: 64,
  overflow: 'hidden',
  ':disabled': {
    cursor: 'not-allowed',
  },
  ...themeConfig.variables.buttonBase,
});

/**
 * @param {string} textColor Text color.
 * @param {string|null} fillColor Fill color.
 * @param {Object} theme Theme with spacing().
 * @returns {Object} Object with `button` and `content` style maps.
 */
const pairFromColors = (textColor, fillColor, theme) => ({
  button: baseButton(textColor, fillColor),
  content: {
    padding: theme.spacing(0, 2, 0),
    color: textColor,
  },
});

const useStyles = makeStyles()((theme, { type, flat, disabled }) => {
  if (type === 'plain') {
    return {
      button: {
        padding: 0,
        outline: 0,
        border: 0,
        textAlign: 'left',
      },
    };
  }

  if (type === 'simple') {
    return disabled
      ? pairFromColors(themeConfig.colors.shade4, themeConfig.colors.shade7, theme)
      : pairFromColors(themeConfig.colors.dark, themeConfig.colors.shade7, theme);
  }

  if (type === 'regular') {
    return disabled
      ? pairFromColors(colors.shade4, null, theme)
      : pairFromColors(colors.dark, null, theme);
  }

  if (type === 'secondary') {
    if (!flat) {
      return disabled
        ? pairFromColors(colors.shade4, colors.shade7, theme)
        : pairFromColors('var(--color-primary-contrast)', 'var(--color-primary)', theme);
    }
    return disabled
      ? pairFromColors(colors.shade4, null, theme)
      : pairFromColors('var(--color-primary)', null, theme);
  }

  if (!flat) {
    return disabled
      ? pairFromColors(colors.shade4, colors.shade7, theme)
      : pairFromColors('var(--color-secondary-contrast)', 'var(--color-secondary)', theme);
  }

  return disabled
    ? pairFromColors(colors.shade4, null, theme)
    : pairFromColors('var(--color-secondary)', null, theme);
});

/**
 * The basic button component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Button = (props) => {
  const {
    className,
    flat,
    disabled,
    testId,
    type,
    wrapContent,
    children,
    onClick,
    ...rest
  } = props;

  const { classes, cx } = useStyles({
    type,
    flat,
    disabled,
  });

  const content = wrapContent ? (
    <div {...(classes.content ? { className: classes.content } : {})}>
      {children}
    </div>
  ) : children;

  return (
    <BaseButton
      {...rest}
      className={cx('ui-shared__button', classes.button, className)}
      disabled={disabled}
      onClick={onClick}
      testId={testId}
    >
      {content}
    </BaseButton>
  );
};

Button.propTypes = {
  ...BaseButton.propTypes,
  className: PropTypes.string,
  flat: PropTypes.bool,
  testId: PropTypes.string,
  type: PropTypes.oneOf(buttonTypes),
  wrapContent: PropTypes.bool,
};

Button.defaultProps = {
  ...BaseButton.defaultProps,
  className: '',
  flat: false,
  type: 'primary',
  wrapContent: true,
  testId: 'Button',
};

export default Button;
