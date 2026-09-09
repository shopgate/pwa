import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import { useLoadImage } from '@shopgate/engage/core';

export interface ProductImagePlaceholderProps {
  /**
   * Drops the background behind the placeholder.
   */
  noBackground?: boolean;
  /**
   * Whether the placeholder gets an inset shadow, matching the image it stands in for.
   */
  showInnerShadow?: boolean;
  /**
   * The merchant configured placeholder image. While it loads, and when it is absent, the
   * built-in icon is shown instead.
   */
  src?: string | null;
}

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
 * @param props The components props.
 * @returns The rendered component.
 */
const ProductImagePlaceholder = (props: ProductImagePlaceholderProps) => {
  const {
    src = null,
    showInnerShadow = false,
    noBackground = false,
  } = props;

  const { classes, cx } = useStyles();
  const theme = useTheme();
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const srcLoaded = useLoadImage(src);
  useEffect(() => { setShowPlaceholder(false); }, [srcLoaded]);

  const contentStyles = useMemo<CSSProperties>(() => {
    if (srcLoaded) {
      return {
        backgroundImage: `url(${src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: noBackground ? 'transparent' : theme.palette.common.white,
        position: 'absolute',
      };
    }
    return {
      backgroundColor: noBackground ? 'transparent' : theme.palette.common.white,
    };
  }, [srcLoaded, noBackground, theme.palette.common.white, src]);

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

export default ProductImagePlaceholder;
