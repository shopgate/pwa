import React, { Component, PropTypes } from 'react';
import connect from '../../connector';
import styles from './style';

/**
 * The navigator logo component.
 */
class Logo extends Component {
  static propTypes = {
    logoUrl: PropTypes.string,
  };

  static defaultProps = {
    logoUrl: null,
  };

  /**
   * Constructor
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.isLoaded = false;

    this.state = {
      url: this.props.logoUrl,
    };
  }

  /**
   * The componentDidMount lifecycle hook.
   * Render the image if we have the url in the props.
   */
  componentDidMount() {
    if (this.props.logoUrl) {
      this.loadImage(this.props.logoUrl);
    }
  }

  /**
   * The componentWillReceiveProps lifecycle hook.
   * @param {Object} nextProps The next set of props.
   */
  componentWillReceiveProps(nextProps) {
    if (!this.isLoaded) {
      this.loadImage(nextProps.logoUrl);
    }
  }

  /**
   * The render function.
   * @param {Object} nextProps The next set of props.
   * @returns {boolean}
   */
  shouldComponentUpdate() {
    return !this.isLoaded;
  }

  /**
   * Updates the state with the given url.
   * @param {string} url The image url.
   */
  setUrl = (url) => {
    this.loaded = true;
    this.setState({ url });
  }

  /**
   * Loads an image with the given url.
   * @param {string} url The image url.
   * @returns {Function}
   */
  loadImage = (url) => {
    const image = new Image();
    image.src = url;
    image.onload = () => this.setUrl(url);

    return image.complete;
  }

  /**
   * The render function.
   * @returns {JSX}
   */
  render() {
    if (!this.state.url) {
      return null;
    }

    return <img className={styles.logo} src={this.props.logoUrl} alt="Logo" />;
  }
}

export default connect(Logo);
