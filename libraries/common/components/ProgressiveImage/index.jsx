import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from '../Transition';
import styles from './style';

/**
   * @param {string} src image src
   * @returns {string} image src, corrected for old image service
   */
const getActualImageSrc = (src) => {
  if (src && src.startsWith('https://img-cdn.shopgate.com') && !src.includes('?')) {
    return `${src}?w=440&q=70&h=440&fillc=fff`;
  }
  return src;
};

/**
 * The progressive image component. It supports lazy and progressive loading of images.
 */
class ProgressiveImage extends Component {
  static propTypes = {
    alt: PropTypes.string,
    animating: PropTypes.bool,
    backgroundColor: PropTypes.string,
    className: PropTypes.string,
    forcePlaceholder: PropTypes.bool,
    highestResolutionLoaded: PropTypes.func,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    srcset: PropTypes.arrayOf(PropTypes.string),
    transition: PropTypes.shape(),
  };

  static defaultProps = {
    alt: null,
    animating: true,
    backgroundColor: '#f2f2f2',
    className: '',
    forcePlaceholder: false,
    highestResolutionLoaded: () => {},
    onError: null,
    onLoad: null,
    srcset: [],
    transition: null,
  };

  /**
   * Sets the initial state, to not render image slider component yet.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    /**
     * The initial component state.
     * Preloads all resolutions if already cached will
     * set the state for the resolution to true.
     * @type {Object}
     */
    this.state = {
      loaded: this.props.srcset.map((src, index) => this.loadImage(src, index)),
    };
    this.mounted = false;
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
   * Image loaded event listener
   * @param {number} resolutionIndex The index of the loaded resolution
   */
  imageLoaded(resolutionIndex) {
    if (!this.mounted) {
      return;
    }

    this.setState({
      loaded: this.state.loaded.map((loaded, index) => {
        if (resolutionIndex === index) {
          return true;
        }

        return loaded;
      }),
    });

    if (resolutionIndex === (this.props.srcset.length - 1)) {
      this.props.highestResolutionLoaded();
    }
  }

  /**
   * Preloads the given image in given resolution
   * @param {string} src Source to the image.
   * @param {number} resolutionIndex The index of the loaded resolution.
   * @returns {number} true if image is already in cache.
   */
  loadImage(src, resolutionIndex) {
    const image = new window.Image();
    image.onload = () => {
      this.imageLoaded(resolutionIndex);
      if (this.props.onLoad) {
        this.props.onLoad();
      }
    };
    image.onerror = () => {
      if (this.props.onError) {
        this.props.onError();
      }
    };

    image.src = getActualImageSrc(src);

    return image.complete;
  }

  /**
   * Renders the smooth image component.
   * @returns {JSX}
   */
  render() {
    const index = this.state.loaded.lastIndexOf(true);
    let src = null;

    if (index > -1) {
      src = this.props.srcset[index];
    }

    let innerImage = null;

    if (src && !this.props.forcePlaceholder) {
      // Renders the actual image.
      innerImage = (
        <img
          className={styles.image}
          src={getActualImageSrc(src)}
          alt={this.props.alt}
          role="presentation"
          data-test-id="image"
        />
      );
    }

    const containerStyle = styles.container(this.props.backgroundColor);

    if (
      !this.props.animating ||
      !this.props.transition
    ) {
      return (
        <div className={`${containerStyle} ${this.props.className}`}>
          {innerImage}
        </div>
      );
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

export default ProgressiveImage;
