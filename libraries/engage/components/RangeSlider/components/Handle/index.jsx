import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cxs from 'classnames';
import { i18n } from '@shopgate/engage/core';
import styles from './style';

/**
 * The range slider handle component.
 * @param {Object} props The component properties
 * @param {boolean} props.active Whether this handle is currently touched or was recently touched.
 * @param {number} props.index The index of the handle.
 * @param {Function} props.onTouchStart The touch start event callback.
 * @param {Object} props.classNames (Optional) An additional style classes for the handle.
 * @returns {JSX}
 */
const RangeSliderHandle = (props) => {
  const {
    active, index, onTouchStart, classNames, range, min, max,
  } = props;
  const label = index === 0 ? i18n.text('price.range_from') : i18n.text('price.range_to');
  const valuenow = index === 0 ? Math.floor(range[index] / 100) : Math.ceil(range[index] / 100);

  return (
    <div
      className={cxs(`${classNames.handleOuter || ''} ${styles}`)}
      style={{ zIndex: Number(active) || 0 }}
      onTouchStart={event => onTouchStart(event, index)}
      role="slider"
      aria-valuemin={Math.floor(min / 100)}
      aria-valuemax={Math.ceil(max / 100)}
      aria-valuenow={valuenow}
      aria-label={label}
    >
      <div className={classNames.handleInner} />
    </div>
  );
};

RangeSliderHandle.propTypes = {
  index: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  range: PropTypes.arrayOf(PropTypes.number).isRequired,
  active: PropTypes.bool,
  classNames: PropTypes.shape({
    handleOuter: PropTypes.string,
    handleInner: PropTypes.string,
  }),
};

RangeSliderHandle.defaultProps = {
  active: false,
  classNames: {
    handleOuter: null,
    handleInner: null,
  },
};

export default memo(RangeSliderHandle);
