import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import Widgets from '@shopgate/pwa-common/components/Widgets';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PAGE_CONTENT_BEFORE,
  PAGE_CONTENT,
  PAGE_CONTENT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import View from 'Components/View';
import Button from '@shopgate/ui-material/Button';
import widgets from 'Extensions/widgets';
import connect from './connector';
import styles from './style';

/**
 * The homepage view component.
 * @returns {JSX}
 */
class Page extends Component {
  static propTypes = {
    getPageConfig: PropTypes.func.isRequired,
    params: PropTypes.shape().isRequired,
    configs: PropTypes.shape(),
    style: PropTypes.shape(),
  };

  static defaultProps = {
    configs: {},
    style: null,
  };

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

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
   * Returns the current view title.
   * @return {string}
   */
  get title() {
    const { title } = this.props.configs[this.pageId];

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
    if (!this.props.configs) {
      return null;
    }

    const pageConfig = this.props.configs[this.pageId];

    if (!pageConfig) {
      return null;
    }

    console.error(this.inputRef);

    return (
      <View className={styles.container} style={this.props.style} title={this.title}>
        <section style={{
          position: 'relative',
          margin: 50,
        }}>
          <Button>Welcome</Button>
        </section>
        <Portal name={PAGE_CONTENT_BEFORE} props={{ id: this.pageId }} />
        <Portal name={PAGE_CONTENT} props={{ id: this.pageId }}>
          <div className={styles.widgetWrapper}>
            <Widgets components={widgets} widgets={pageConfig.widgets} />
          </div>
        </Portal>
        <Portal name={PAGE_CONTENT_AFTER} props={{ id: this.pageId }} />
      </View>
    );
  }
}

export default connect(Page);
