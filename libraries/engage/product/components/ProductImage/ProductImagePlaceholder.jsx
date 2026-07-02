import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import { useLoadImage } from '@shopgate/engage/core';

const placeholderIconScale = 0.65;

const useStyles = makeStyles()(theme => ({
  placeholderContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    textAlign: 'center',
  },
  placeholder: {
    position: 'absolute',
    width: `${placeholderIconScale * 100}% !important`,
    height: `${placeholderIconScale * 100}% !important`,
    top: `${(1.0 - placeholderIconScale) * 50}%`,
    left: `${(1.0 - placeholderIconScale) * 50}%`,
    color: theme.palette.background.emphasized,
  },
  innerShadow: {
    position: 'relative',
    overflow: 'hidden',
    ':after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      boxShadow: 'inset 0 0 20px rgba(0, 0, 0, .05)',
      pointerEvents: 'none',
    },
  },
}));

/**
 * The ProductImagePlaceholder component.
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const ProductImagePlaceholder = ({
  src, showInnerShadow, noBackground,
}) => {
  const { classes, cx } = useStyles();
  const theme = useTheme();
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const srcLoaded = useLoadImage(src);
  useEffect(() => { setShowPlaceholder(false); }, [srcLoaded]);

  const contentStyles = useMemo(() => {
    if (srcLoaded) {
      return {
        backgroundImage: `url(${src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: noBackground ? 'transparent' : theme.palette.background.surface,
        position: 'absolute',
      };
    }
    return {
      backgroundColor: noBackground ? 'transparent' : theme.palette.background.surface,
    };
  }, [srcLoaded, noBackground, theme.palette.background.surface, src]);

  const contentClasses = cx(classes.placeholderContent, {
    [classes.innerShadow]: showInnerShadow,
  });

  return (
    <div className={contentClasses} style={contentStyles} data-test-id="placeHolder">
      {showPlaceholder && <PlaceholderIcon className={classes.placeholder} />}
      {!showPlaceholder && ' '}
    </div>
  );
};

ProductImagePlaceholder.propTypes = {
  noBackground: PropTypes.bool,
  showInnerShadow: PropTypes.bool,
  src: PropTypes.string,
};

ProductImagePlaceholder.defaultProps = {
  src: null,
  noBackground: false,
  showInnerShadow: false,
};

export default ProductImagePlaceholder;
