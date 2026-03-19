import React from 'react';
import classNames from 'classnames';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { Link } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: '.875rem',
    fontWeight: 300,
    lineHeight: 1.5,
    padding: '0 1rem 1rem',
  },
  link: {
    textAlign: 'center',
    fontWeight: 600,
    marginTop: 8,
  },
});

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
  const { classes } = useStyles();
  if (!text) {
    return null;
  }

  return (
    <div className={classNames(classes.root, 'engage__reviews__review_info_text')}>
      <div>
        {text}
        { linkText && linkUrl && (
          <Link href={linkUrl} className={classes.link}>
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReviewsInfo;
