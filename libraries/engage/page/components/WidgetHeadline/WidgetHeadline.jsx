import React, { useMemo } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';
import PropTypes from 'prop-types';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));

/** @typedef {import('@shopgate/engage/components/Typography').TypographyProps} TypographyProps */

/**
 * @typedef {Object} HeadlineProps
 * @property {string} text The headline text.
 * @property {TypographyProps['align]} [textAlign] The text alignment.
 * @property {TypographyProps['variant']} [typography] The typography variant to use.
 * @property {boolean} [bold] Whether the text should be bold.
 * @property {boolean} [italic] Whether the text should be italic.
 * @property {boolean} [underline] Whether the text should be underlined.
 */

/** @typedef {{headline: HeadlineProps} & TypographyProps} WidgetHeadlineProps */

/**
 * The WidgetHeadline is used to display a headline for the widget.
 * @param {WidgetHeadlineProps} props The component props.
 * @returns {JSX.Element}
 */
const WidgetHeadline = ({
  headline,
  className,
  ...rest
}) => {
  const { classes, cx, css } = useStyles();

  const {
    typography = 'h3',
    text,
    textAlign,
    bold,
    italic,
    underline,
  } = headline || {};

  const styles = useMemo(() => ({
    ...(bold && { fontWeight: 'bold' }),
    ...(italic && { fontStyle: 'italic' }),
    ...(underline && { textDecoration: 'underline' }),
  }), [bold, italic, underline]);

  if (!text) return null;

  return (
    <Typography
      variant={typography}
      align={textAlign}
      // && increases the specificity of the styles which guarantees that defaults are overridden
      className={cx(css({ '&&': { ...styles } }), classes.root, className)}
      {...rest}
    >
      {text}
    </Typography>
  );
};

WidgetHeadline.propTypes = {
  headline: PropTypes.shape().isRequired,
  className: PropTypes.string,
};

WidgetHeadline.defaultProps = {
  className: null,
};

export default WidgetHeadline;
