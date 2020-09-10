import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { Image } from '@shopgate/engage/components';
import styles from './style';

const { colors } = themeConfig;

/**
 * The ProductImagePlaceholder component.
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const ProductImagePlaceholder = ({
  src, alt, showInnerShadow, noBackground,
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const onError = useCallback(() => {
    setShowPlaceholder(true);
  }, [setShowPlaceholder]);

  return (
    <div className={styles.placeholderContent} data-test-id="placeHolder">
      { showPlaceholder ? (
        <PlaceholderIcon className={styles.placeholder} />
      ) : (
        <Image
          alt={alt}
          src={src}
          className={showInnerShadow ? styles.innerShadow : ''}
          styles={{ backgroundColor: noBackground ? 'transparent' : colors.light }}
          onError={onError}
        />
      )}
    </div>
  );
};

ProductImagePlaceholder.propTypes = {
  alt: PropTypes.string,
  noBackground: PropTypes.bool,
  showInnerShadow: PropTypes.bool,
  src: PropTypes.string,
};

ProductImagePlaceholder.defaultProps = {
  alt: null,
  src: null,
  noBackground: false,
  showInnerShadow: false,
};

export default ProductImagePlaceholder;
