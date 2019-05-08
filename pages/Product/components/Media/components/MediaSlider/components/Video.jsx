import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

/**
 * The product media video slide component.
 */
class Video extends Component {
  static propTypes = {
    media: PropTypes.shape({
      code: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  };

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.media, nextProps.media);
  }

  /**
   * Renders the product media slider component.
   * @returns {JSX}
   */
  render() {
    const { media } = this.props;

    /** @TODO */
    return (
      <div>@TODO {JSON.stringify(media)}</div>
    );
  }
}

export default Video;
