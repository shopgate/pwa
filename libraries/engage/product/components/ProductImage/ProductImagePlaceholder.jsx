import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useLoadImage } from '@shopgate/engage/core';
import styles from './style';

const { colors } = themeConfig;

/**
 * The ProductImagePlaceholder component.
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const ProductImagePlaceholder = ({
  src, showInnerShadow, noBackground,
}) => {
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
        backgroundColor: noBackground ? 'transparent' : colors.light,
        position: 'absolute',
      };
    }
    return {
      backgroundColor: noBackground ? 'transparent' : colors.light,
    };
  }, [src, noBackground, srcLoaded]);

  const contentClasses = classnames(styles.placeholderContent, {
    [styles.innerShadow]: showInnerShadow,
  });

  return (
    <div className={contentClasses} style={contentStyles} data-test-id="placeHolder">
      { showPlaceholder && <PlaceholderIcon className={styles.placeholder} />}
      { !showPlaceholder && ' ' }
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
