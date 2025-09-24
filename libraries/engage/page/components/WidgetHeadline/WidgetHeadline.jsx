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
 * The WidgetHeadline is used to display a headline for the widget.
 * @param {Object} props The component props.
 * @param {Object} props.headline The headline props.
 * @returns {JSX.Element}
 */
const WidgetHeadline = ({ headline, className }) => {
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
