import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';
import { useHeadlineWidget } from './hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));

/**
 * The HeadlineWidget is used to display a headline text.
 * @returns {JSX.Element}
 */
const Headline = () => {
  const { cx, css, classes } = useStyles();
  const {
    headline, align, variant, styles,
  } = useHeadlineWidget();

  if (!headline) return null;

  return (
    <Typography
      // && increases the specificity of the styles which guarantees that defaults are overridden
      className={cx(css({ '&&': { ...styles } }), classes.root)}
      variant={variant}
      align={align}
      gutterBottom
    >
      {headline}
    </Typography>
  );
};

export default Headline;
