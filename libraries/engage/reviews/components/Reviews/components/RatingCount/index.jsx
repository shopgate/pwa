import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  greyStyle: {
    fontSize: 12,
    margin: '0 0.5em',
    lineHeight: '2em',
    color: colors.shade3,
  },
  prominentStyle: {
    fontSize: 12,
    margin: '0 0.5em',
    lineHeight: '2em',
    color: 'var(--color-primary)',
  },
});

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const RatingCount = (props) => {
  const { classes } = useStyles();

  if (!props.count) {
    return null;
  }

  return (
    <I18n.Text
      string="reviews.review_count"
      params={props}
      className={classNames({
        [classes.greyStyle]: true,
        [classes.prominentStyle]: props.prominent,
      }, 'engage__reviews__rating-count')}
    />
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
