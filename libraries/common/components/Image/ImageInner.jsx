import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';
import styles from './style';

/**
 * The ImageInner component renders tha actual image of the Image component.
 * @param {Object} props The component props
 * @param {Function} ref The component reference
 * @returns {JSX.Element}
 */
const ImageInner = forwardRef(({
  src,
  className,
  alt,
  lazy,
  onLoad,
  onError,
  style,
}, ref) => (
  <img
    ref={ref}
    loading={lazy ? 'lazy' : 'eager'}
    src={src}
    className={classNames(
      className,
      styles.image,
      'common__image'
    )}
    alt={alt}
    aria-label={alt}
    aria-hidden={!alt}
    data-test-id="image"
    onLoad={onLoad}
    onError={onError}
    style={style}
  />
));

ImageInner.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  lazy: PropTypes.bool,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  src: PropTypes.string,
  style: PropTypes.shape(),
};

ImageInner.defaultProps = {
  src: null,
  alt: null,
  className: null,
  lazy: false,
  style: null,
  onError: noop,
  onLoad: noop,
};

export default ImageInner;
