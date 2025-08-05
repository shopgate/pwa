import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@shopgate/engage/styles';
import classNames from 'classnames';

/**
 * Capitalizes the first letter of a string.
 * @param {string} string The string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 */
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * @typedef {import('../../styles').Theme} Theme
 */

/**
 * Creates the styles for the Typography component.
 * @param {Theme} theme The theme object.
 * @returns {Object} The styles object.
 */
export const styles = theme => ({
  /* Styles applied to the root element. */
  root: {
    margin: 0,
  },
  /* Styles applied to the root element if `variant="body2"`. */
  body2: theme.typography.body2,
  /* Styles applied to the root element if `variant="body1"`. */
  body1: theme.typography.body1,
  /* Styles applied to the root element if `variant="caption"`. */
  caption: theme.typography.caption,
  /* Styles applied to the root element if `variant="button"`. */
  button: theme.typography.button,
  /* Styles applied to the root element if `variant="h1"`. */
  h1: theme.typography.h1,
  /* Styles applied to the root element if `variant="h2"`. */
  h2: theme.typography.h2,
  /* Styles applied to the root element if `variant="h3"`. */
  h3: theme.typography.h3,
  /* Styles applied to the root element if `variant="h4"`. */
  h4: theme.typography.h4,
  /* Styles applied to the root element if `variant="h5"`. */
  h5: theme.typography.h5,
  /* Styles applied to the root element if `variant="h6"`. */
  h6: theme.typography.h6,
  /* Styles applied to the root element if `variant="subtitle1"`. */
  subtitle1: theme.typography.subtitle1,
  /* Styles applied to the root element if `variant="subtitle2"`. */
  subtitle2: theme.typography.subtitle2,
  /* Styles applied to the root element if `variant="overline"`. */
  overline: theme.typography.overline,
  /* Styles applied to the root element if `variant="srOnly"`. Only accessible to screen readers. */
  srOnly: {
    position: 'absolute',
    height: 1,
    width: 1,
    overflow: 'hidden',
  },
  /* Styles applied to the root element if `align="left"`. */
  alignLeft: {
    textAlign: 'left',
  },
  /* Styles applied to the root element if `align="center"`. */
  alignCenter: {
    textAlign: 'center',
  },
  /* Styles applied to the root element if `align="right"`. */
  alignRight: {
    textAlign: 'right',
  },
  /* Styles applied to the root element if `align="justify"`. */
  alignJustify: {
    textAlign: 'justify',
  },
  /* Styles applied to the root element if `nowrap={true}`. */
  noWrap: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  /* Styles applied to the root element if `gutterBottom={true}`. */
  gutterBottom: {
    marginBottom: '0.35em',
  },
  /* Styles applied to the root element if `paragraph={true}`. */
  paragraph: {
    marginBottom: 16,
  },
  /* Styles applied to the root element if `color="inherit"`. */
  colorInherit: {
    color: 'inherit',
  },
  /* Styles applied to the root element if `color="primary"`. */
  colorPrimary: {
    color: theme.palette.primary.main,
  },
  /* Styles applied to the root element if `color="secondary"`. */
  colorSecondary: {
    color: theme.palette.secondary.main,
  },
  /* Styles applied to the root element if `color="textPrimary"`. */
  colorTextPrimary: {
    color: theme.palette.text.primary,
  },
  /* Styles applied to the root element if `color="textSecondary"`. */
  colorTextSecondary: {
    color: theme.palette.text.secondary,
  },
  colorTextTertiary: {
    color: theme.palette.text.tertiary,
  },
  /* Styles applied to the root element if `color="error"`. */
  colorError: {
    color: theme.palette.error.main,
  },
  /* Styles applied to the root element if `color="warning"` */
  colorWarning: {
    color: theme.palette.warning.main,
  },
  /* Styles applied to the root element if `color="success"` */
  colorSuccess: {
    color: theme.palette.success.main,
  },
  /* Styles applied to the root element if `display="inline"`. */
  displayInline: {
    display: 'inline',
  },
  /* Styles applied to the root element if `display="block"`. */
  displayBlock: {
    display: 'block',
  },
});

const defaultVariantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
};

const Typography = React.forwardRef((props, ref) => {
  const {
    align = 'inherit',
    className,
    color = 'initial',
    component,
    display = 'initial',
    gutterBottom = false,
    noWrap = false,
    paragraph = false,
    variant = 'body1',
    variantMapping = defaultVariantMapping,
    classes,
    ...other
  } = props;

  const Component =
    component ||
    (paragraph ? 'p' : variantMapping[variant] || defaultVariantMapping[variant]) ||
    'span';

  return (
    <Component
      className={classNames(
        classes.root,
        {
          [classes[variant]]: variant !== 'inherit',
          [classes[`color${capitalize(color)}`]]: color !== 'initial',
          [classes.noWrap]: noWrap,
          [classes.gutterBottom]: gutterBottom,
          [classes.paragraph]: paragraph,
          [classes[`align${capitalize(align)}`]]: align !== 'inherit',
          [classes[`display${capitalize(display)}`]]: display !== 'initial',
        },
        className
      )}
      ref={ref}
      {...other}
    />
  );
});

Typography.propTypes = {
  classes: PropTypes.shape().isRequired,
  align: PropTypes.oneOf(['inherit', 'left', 'center', 'right', 'justify']),
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'initial',
    'inherit',
    'primary',
    'secondary',
    'textPrimary',
    'textSecondary',
    'textTertiary',
    'error',
    'warning',
    'success',
  ]),
  component: PropTypes.elementType,
  display: PropTypes.oneOf(['initial', 'block', 'inline']),
  gutterBottom: PropTypes.bool,
  noWrap: PropTypes.bool,
  paragraph: PropTypes.bool,
  variant: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline',
    'srOnly',
    'inherit',
  ]),
  variantMapping: PropTypes.shape(),
};

Typography.defaultProps = {
  align: 'inherit',
  children: null,
  className: undefined,
  color: 'initial',
  component: null,
  display: 'initial',
  gutterBottom: false,
  noWrap: false,
  paragraph: false,
  variant: 'body1',
  variantMapping: defaultVariantMapping,
};

export default withStyles(Typography, styles, { name: 'Typography' });
