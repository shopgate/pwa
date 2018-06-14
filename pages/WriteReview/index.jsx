import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import ReviewForm from './components/ReviewForm';

/**
 * The view that holds a review form.
 */
class WriteReview extends Component {
  static propTypes = {
    productId: PropTypes.string,
  }

  static defaultProps = {
    productId: null,
  }

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Get view title.
   */
  get title() {
    const { __ } = this.context.i18n();
    return __('titles.reviews');
  }

  /**
   * Render view
   * @return {JSX}
   */
  render() {
    return (
      <View>
        {this.props.productId && <ReviewForm productId={this.props.productId} />}
      </View>
    );
  }
}

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <WriteReview productId={hex2bin(params.productId) || null} />
    )}
  </RouteContext.Consumer>
);
