import React from 'react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { Link, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    marginTop: 8,
    fontWeight: 300,
    lineHeight: 1.5,
    padding: '0 1rem 1rem',
  },
  link: {
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightBold,
    marginTop: 8,
  },
}));

const {
  reviewsInfo: {
    text,
    linkText,
    linkUrl,
  } = {},
} = appConfig;

/**
 * The ReviewsInfo component
 * @returns {JSX.Element}
 */
const ReviewsInfo = () => {
  const { classes, cx } = useStyles();
  if (!text) {
    return null;
  }

  return (
    <Typography variant="body2" component="div" align="center" className={cx(classes.root, 'engage__reviews__review_info_text')}>
      <div>
        {text}
        { linkText && linkUrl && (
          <Link href={linkUrl} className={classes.link}>
            {linkText}
          </Link>
        )}
      </div>
    </Typography>
  );
};

export default ReviewsInfo;
