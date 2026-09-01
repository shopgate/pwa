import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));

/**
 * The CategoryImage component
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const CategoryImage = ({ className, src, placeholderSrc }) => {
  const { classes, cx } = useStyles();

  if (!src && !placeholderSrc) {
    return null;
  }

  return (
    <Image
      className={cx(classes.root, className)}
      src={src}
      // Unwrapped, so the fallback renders into the container the outer Image already provides
      // rather than nesting a second aspect ratio box inside it.
      placeholder={placeholderSrc ? <Image unwrapped src={placeholderSrc} /> : null}
    />
  );
};

CategoryImage.propTypes = {
  className: PropTypes.string,
  placeholderSrc: PropTypes.string,
  src: PropTypes.string,
};

CategoryImage.defaultProps = {
  src: null,
  placeholderSrc: null,
  className: null,
};

export default connect(CategoryImage);
