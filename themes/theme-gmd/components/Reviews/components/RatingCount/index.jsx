import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import { greyStyle, prominentStyle } from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const RatingCount = (props) => {
  if (!props.count) {
    return null;
  }

  return (
    <I18n.Text
      string="reviews.review_count"
      params={props}
      className={classNames({
        [greyStyle]: true,
        [prominentStyle]: props.prominent,
      })}
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
