import React from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import Image from '@shopgate/pwa-common/components/Image';
import BackButton from '../BackButton';
import ZoomPanSlider from '../ZoomPanSlider';
import styles from './style';
import connect from './connector';

const resolutions = [
  {
    width: 440,
    height: 440,
  },
  {
    width: 2048,
    height: 2048,
  },
];

/**
 * @return {JSX}
 */
const ProductGalleryContent = ({ initialSlide, images }) => (
  <View hasNavigator={false} isFullscreen>
    <div className={styles.navButton}>
      <BackButton />
    </div>
    <div className={styles.container}>
      {images && (
        <ZoomPanSlider
          classNames={styles.sliderStyles}
          className={styles.slider}
          initialSlide={initialSlide}
          indicators
          loop
        >
          {images.map(imageSrc => (
            <div className={styles.slide} key={imageSrc}>
              <Image src={imageSrc} resolutions={resolutions} />
            </div>
          ))}
        </ZoomPanSlider>
      )}
    </div>
  </View>
);

ProductGalleryContent.propTypes = {
  initialSlide: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape()),
};

ProductGalleryContent.defaultProps = {
  images: [],
};

export default connect(ProductGalleryContent);
