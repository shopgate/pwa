import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';
import PropTypes from 'prop-types';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  underline: { textDecoration: 'underline' },
}));

/**
 * The WidgetHeadline is used to display a headline for the widget.
 * @param {Object} props The component props.
 * @param {Object} props.headline The headline props.
 * @returns {JSX.Element}
 */
const WidgetHeadline = ({ headline }) => {
  const { classes, cx } = useStyles();

  const {
    typography = 'h3',
    text,
    textAlign,
    bold,
    italic,
    underline,
  } = headline;

  if (!text) return null;

  return (
    <Typography
      variant={typography}
      align={textAlign}
      className={cx(classes.root, {
        [classes.bold]: bold,
        [classes.italic]: italic,
        [classes.underline]: underline,
      })}
    >
      {text}
    </Typography>
  );
};

WidgetHeadline.propTypes = {
  headline: PropTypes.shape().isRequired,
};

export default WidgetHeadline;
