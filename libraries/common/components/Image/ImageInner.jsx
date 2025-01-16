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
}, ref) => (
  <img
    ref={ref}
    className={classNames(
      className,
      styles.image,
      'common__image'
    )}
    alt={alt}
    aria-label={alt}
    role="presentation"
    data-test-id="image"
    loading={lazy ? 'lazy' : 'eager'}
    src={src}
    onLoad={onLoad}
    onError={onError}
  />
));

ImageInner.propTypes = {
  lazy: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
};

ImageInner.defaultProps = {
  alt: null,
  className: null,
  onError: noop,
  onLoad: noop,
};

export default ImageInner;
