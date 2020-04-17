import React from 'react';
import PropTypes from 'prop-types';
import cxs from 'classnames';
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
    active, index, onTouchStart, classNames, useMouseEvents,
  } = props;

  const style = { zIndex: Number(active) || 0 };
  const eventHandler = {
    [useMouseEvents ? 'onMouseDown' : 'onTouchStart']: event => onTouchStart(event, index),
  };

  return (
    <div
      className={cxs(classNames.handleOuter, styles)}
      style={style}
      {...eventHandler}
    >
      <div className={classNames.handleInner} />
    </div>
  );
};

RangeSliderHandle.propTypes = {
  index: PropTypes.number.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  useMouseEvents: PropTypes.bool.isRequired,
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

export default RangeSliderHandle;
