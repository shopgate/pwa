import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { getFullImageSource, logger } from '@shopgate/engage/core';
import Transition from '../Transition';
import styles from './style';

/**
 * The image component. It supports lazy and progressive loading of images.
 */
class Image extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    animating: PropTypes.bool,
    backgroundColor: PropTypes.string,
    className: PropTypes.string,
    forcePlaceholder: PropTypes.bool,
    highestResolutionLoaded: PropTypes.func,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    ratio: PropTypes.arrayOf(PropTypes.number),
    resolutions: PropTypes.arrayOf(PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      blur: PropTypes.number,
    })),
    transition: PropTypes.shape(),
  };

  static defaultProps = {
    alt: null,
    animating: true,
    backgroundColor: themeColors.placeholder,
    className: '',
    forcePlaceholder: false,
    highestResolutionLoaded: () => {},
    onError: null,
    onLoad: null,
    ratio: null,
    resolutions: [
      {
        width: 50,
        height: 50,
        blur: 2,
      },
      {
        width: 440,
        height: 440,
      },
    ],
    transition: null,
  };

  /**
   * Sets the initial state, to not render image slider component yet.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/prop-types
    logger.assert(!props.srcmap, 'Use of srcmap prop is deprecated. Use resolutions instead');

    props.resolutions.forEach((resolution, index) => this.loadImage(this.props.src, index));

    this.mounted = false;
    this.imgRef = React.createRef();
    this.resolutionRef = React.createRef();
  }

  /**
   * When component is added to the DOM.
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
   * When component was removed from DOM.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Sets the image ratio based on width and height.
   * @return {number} The image ratio.
   */
  get imageRatio() {
    if (this.props.ratio) {
      const [x, y] = this.props.ratio;

      return ((y / x) * 100).toFixed(3);
    }

    const { width, height } = this.props.resolutions[this.props.resolutions.length - 1];

    return ((height / width) * 100).toFixed(3);
  }

  /**
   * Image loaded event listener
   * @param {number} resolutionIndex The index of the loaded resolution
   * @param {string} imgSrc .
   */
  imageLoaded(resolutionIndex, imgSrc) {
    if (!this.mounted) {
      return;
    }

    const resolution = this.props.resolutions[resolutionIndex];
    const updateImg = !this.resolutionRef.current
      || this.resolutionRef.current.width < resolution.width;

    if (updateImg && this.imgRef.current) {
      this.resolutionRef.current = resolution;
      this.imgRef.current.src = imgSrc;

      const inlineStyles = {
        width: '100%',
      };
      if (resolution.blur) {
        inlineStyles.filter = `blur(${resolution.blur}px)`;
      }
      this.imgRef.current.style = inlineStyles;
    }

    if (resolutionIndex === this.props.resolutions.length - 1) {
      this.props.highestResolutionLoaded();
    }
  }

  /**
   * Pre-loads the given image in given resolution
   * @param {string} src Source to the image.
   * @param {number} resolutionIndex The index of the loaded resolution.
   * @returns {number} true if image is already in cache.
   */
  loadImage(src, resolutionIndex) {
    const image = new window.Image();
    image.onload = () => {
      this.imageLoaded(resolutionIndex, image.src);
      if (this.props.onLoad) {
        this.props.onLoad();
      }
    };
    image.onerror = () => {
      if (this.props.onError) {
        this.props.onError();
      }
    };

    image.src = getFullImageSource(src, this.props.resolutions[resolutionIndex]);
    return image.complete;
  }

  /**
   * Renders the smooth image component.
   * @returns {JSX}
   */
  render() {
    let innerImage = null;

    if (!this.props.forcePlaceholder) {
      // Renders the actual image.
      innerImage = (
        <img
          className={styles.image}
          alt={this.props.alt}
          src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
          role="presentation"
          data-test-id="image"
          ref={this.imgRef}
        />
      );
    }

    const containerStyle = styles.container(this.props.backgroundColor, `${this.imageRatio}%`);

    if (!this.props.animating || !this.props.transition) {
      return <div className={`${containerStyle} ${this.props.className}`}>{innerImage}</div>;
    }

    return (
      <Transition
        childrenStyles={this.props.transition}
        className={`${containerStyle} ${this.props.className}`}
      >
        {innerImage}
      </Transition>
    );
  }
}

export default Image;
