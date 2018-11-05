import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import ProgressiveImage from '@shopgate/pwa-common/components/ProgressiveImage';
import BackButton from './components/BackButton';
import ZoomPanSlider from './components/ZoomPanSlider';
import connect from './connector';
import styles from './style';

/**
 * The product images component.
 */
class ProductGallery extends Component {
  static propTypes = {
    disableNavigator: PropTypes.func.isRequired,
    enableNavigator: PropTypes.func.isRequired,
    getProductImagesResolutions: PropTypes.func.isRequired,
    params: PropTypes.shape().isRequired,
    initialSlide: PropTypes.number,
    product: PropTypes.shape(),
    resolutions: PropTypes.shape(),
  };

  static defaultProps = {
    resolutions: {},
    initialSlide: 0,
    product: null,
  };

  /**
   * ComponentDidMount lifecycle hook. Will disable the navigator and request the images.
   */
  componentDidMount() {
    this.props.disableNavigator();
    this.props.getProductImagesResolutions();
  }

  /**
   * ComponentWillUnmount lifecycle hook. Will enable the navigator.
   */
  componentWillUnmount() {
    this.props.enableNavigator();
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const title = this.props.product ? this.props.product.name : '';
    const initialSlide = this.props.params.initialSlide ?
      parseInt(this.props.params.initialSlide, 10)
      : 0;

    const rows = [];
    if (this.props.resolutions) {
      const resolutionStrings = Object.keys(this.props.resolutions);
      resolutionStrings.forEach((resolutionString) => {
        let counter = 0;
        this.props.resolutions[resolutionString].forEach((image) => {
          if (!rows[counter]) rows[counter] = [];
          rows[counter].push(image);
          counter += 1;
        });
      });
    }

    return (
      <View title={title} hasNavigator={false} isFullscreen >
        <div className={styles.navButton}>
          <BackButton />
        </div>
        <div className={styles.container}>
          {rows && (
            <ZoomPanSlider
              classNames={styles.sliderStyles}
              className={styles.slider}
              initialSlide={initialSlide}
              indicators
              loop
            >
              {rows.map(srcset => (
                <ProgressiveImage srcset={srcset} key={JSON.stringify(srcset)} />
              ))}
            </ZoomPanSlider>
          )}
        </div>
      </View>
    );
  }
}

export default connect(ProductGallery);
