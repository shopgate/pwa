import React, { Component, PropTypes } from 'react';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import { View } from '../../components/View';
import connect from './connector';
// import PageTemplate from './template.rt';

/**
 * The homepage view component.
 * @returns {JSX}
 */
class Page extends Component {
  static propTypes = {
    getPageConfig: PropTypes.func,
    params: PropTypes.shape(),
    configs: PropTypes.shape(),
    style: PropTypes.shape(),
  };

  static defaultProps = {
    getPageConfig: () => {},
    params: {},
    configs: {},
    style: null,
  };

  /**
   * ComponentDidMount lifecycle hook.
   */
  componentDidMount() {
    this.props.getPageConfig(this.pageId);
  }

  /**
   * Getter for pageId with fallback to index route.
   * @returns {string} The page identifier.
   */
  get pageId() {
    return this.props.params.pageId || PAGE_ID_INDEX;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    if (!this.props.configs) {
      return null;
    }

    const pageConfig = this.props.configs[this.pageId];

    if (!pageConfig) {
      return null;
    }

    return (
      <View style={this.props.style}>
        <div />
      </View>
    );
  }
}

export default connect(Page);
