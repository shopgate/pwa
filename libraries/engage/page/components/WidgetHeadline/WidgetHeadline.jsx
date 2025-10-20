import React, { useMemo } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';
import PropTypes from 'prop-types';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));

/**
 * @typedef {Object} WidgetMargins
 * @property {number} marginTop The top margin.
 * @property {number} marginRight The right margin.
 * @property {number} marginBottom The bottom margin.
 * @property {number} marginLeft The left margin.
 */

/**
 * The WidgetHeadline is used to display a headline for the widget.
 * @param {Object} props The component props.
 * @param {Object} props.headline The headline props.
 * @param {WidgetMargins} [props.widgetMargins] The margins of the widget that renders the headline.
 * When passed widget margins will be used to replace the default padding for the headline.
 * @returns {JSX.Element}
 */
const WidgetHeadline = ({
  headline,
  className,
  widgetMargins,
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
    ...widgetMargins.marginLeft ? {
      marginLeft: widgetMargins.marginLeft * -1,
      paddingLeft: widgetMargins.marginLeft,
    } : null,
    ...widgetMargins.marginRight ? {
      marginRight: widgetMargins.marginRight * -1,
      paddingRight: widgetMargins.marginRight,
    } : null,
  }), [bold, italic, underline, widgetMargins]);

  if (!text) return null;

  return (
    <Typography
      variant={typography}
      align={textAlign}
      // && increases the specificity of the styles which guarantees that defaults are overridden
      className={cx(css({ '&&': { ...styles } }), classes.root, className)}
    >
      {text}
    </Typography>
  );
};

WidgetHeadline.propTypes = {
  headline: PropTypes.shape().isRequired,
  className: PropTypes.string,
  widgetMargins: PropTypes.shape({
    marginTop: PropTypes.number,
    marginRight: PropTypes.number,
    marginBottom: PropTypes.number,
    marginLeft: PropTypes.number,
  }),
};

WidgetHeadline.defaultProps = {
  className: null,
  widgetMargins: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
};

export default WidgetHeadline;
