import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    maxHeight: '100%',
    WebkitTouchCallout: 'none',
    fontSize: 0,
  },
});

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
}, ref) => {
  const { classes, cx } = useStyles();

  return (
    <img
      ref={ref}
      loading={lazy ? 'lazy' : 'eager'}
      src={src}
      className={cx(
        classes.image,
        'common__image',
        className
      )}
      alt={alt}
      aria-label={alt}
      aria-hidden={!alt}
      data-test-id="image"
      onLoad={onLoad}
      onError={onError}
      style={style}
    />
  );
});

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
