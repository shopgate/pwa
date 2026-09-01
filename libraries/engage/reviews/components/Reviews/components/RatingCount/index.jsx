import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  greyStyle: {
    margin: '0 0.5em',
    lineHeight: '2em',
    color: theme.palette.grey.medium,
  },
  prominentStyle: {
    margin: '0 0.5em',
    lineHeight: '2em',
    color: theme.palette.primary.main,
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const RatingCount = (props) => {
  const { classes, cx } = useStyles();

  if (!props.count) {
    return null;
  }

  return (
    <Typography
      variant="caption"
      component="span"
      className={cx({
        [classes.greyStyle]: true,
        [classes.prominentStyle]: props.prominent,
      }, 'engage__reviews__rating-count')}
    >
      <I18n.Text
        string="reviews.review_count"
        params={props}
      />
    </Typography>
  );
};

RatingCount.propTypes = {
  count: PropTypes.number,
  prominent: PropTypes.bool,
};

RatingCount.defaultProps = {
  count: null,
  prominent: false,
};

export default RatingCount;
