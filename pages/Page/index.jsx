import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Widgets from '@shopgate/pwa-common/components/Widgets';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PAGE_CONTENT_BEFORE,
  PAGE_CONTENT,
  PAGE_CONTENT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import View from 'Components/View';
import widgets from 'Extensions/widgets';
import connect from './connector';
import styles from './style';

/**
 * The homepage view component.
 * @returns {JSX}
 */
class Page extends Component {
  static propTypes = {
    configs: PropTypes.shape(),
    pageId: PropTypes.string,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    configs: {},
    pageId: null,
    style: null,
  };

  /**
   * @param {Object} nextProps The next component props.
   * @return {JSX}
   */
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.configs, nextProps.configs)) return true;
    if (this.props.pageId !== nextProps.pageId) return true;
    return false;
  }

  /**
   * Returns the current view title.
   * @return {string}
   */
  get title() {
    const { title } = this.props.configs[this.props.pageId];

    if (!title) {
      return '';
    }

    return title;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    if (!this.props.pageId || !this.props.configs) {
      return null;
    }

    const pageConfig = this.props.configs[this.props.pageId];

    if (!pageConfig) {
      return null;
    }

    return (
      <View className={styles.container} style={this.props.style} title={this.title}>
        <Portal name={PAGE_CONTENT_BEFORE} props={{ id: this.props.pageId }} />
        <Portal name={PAGE_CONTENT} props={{ id: this.props.pageId }}>
          <div className={styles.widgetWrapper}>
            <Widgets components={widgets} widgets={pageConfig.widgets} />
          </div>
        </Portal>
        <Portal name={PAGE_CONTENT_AFTER} props={{ id: this.props.pageId }} />
      </View>
    );
  }
}

export default connect(Page);
