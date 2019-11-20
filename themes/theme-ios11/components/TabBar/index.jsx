import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import KeyboardConsumer from '@shopgate/pwa-common/components/KeyboardConsumer';
import getTabActionComponentForType, { tabs } from './helpers/getTabActionComponentForType';
import {
  TAB_BAR,
  TAB_BAR_BEFORE,
  TAB_BAR_AFTER,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
} from './constants';
import connect from './connector';
import styles, { updateHeightCSSProperty } from './style';
import visibleTabs from './tabs';

/**
 * Renders the action for a given tab configuration.
 * @param {Object} tab The tab configuration.
 * @param {boolean} isHighlighted Whether the tab is currently highlighted.
 * @param {string} path The current history path.
 * @returns {JSX}
 */
const createTabAction = (tab, isHighlighted, path) => {
  const Action = getTabActionComponentForType(tab.type);

  return (
    <Action
      key={tab.type}
      {...tab}
      isHighlighted={isHighlighted}
      path={path}
    />
  );
};

/**
 * The TabBar component
 */
class TabBar extends PureComponent {
  static show = () => {
    UIEvents.emit(SHOW_TAB_BAR);
  }

  static hide = () => {
    UIEvents.emit(HIDE_TAB_BAR);
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    activeTab: null,
    isVisible: true,
  };

  state = { isVisible: this.props.isVisible };

  /** Did mount hook */
  componentDidMount() {
    UIEvents.addListener(SHOW_TAB_BAR, this.show);
    UIEvents.addListener(HIDE_TAB_BAR, this.hide);
    updateHeightCSSProperty(this.props.isVisible);
  }

  /**
   * @param {Object} nextProps next props
   */
  componentWillReceiveProps({ isVisible }) {
    if (this.state.isVisible !== isVisible) {
      this.setState({ isVisible });
    }
  }

  /** Will unmount hook */
  componentWillUnmount() {
    UIEvents.removeListener(SHOW_TAB_BAR, this.show);
    UIEvents.removeListener(HIDE_TAB_BAR, this.hide);
  }

  show = () => {
    this.setState({
      isVisible: true,
    });
  }

  hide = () => {
    this.setState({
      isVisible: false,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { activeTab, path } = this.props;
    const { isVisible } = this.state;
    if (!isVisible) {
      return null;
    }

    const props = {
      isVisible,
      activeTab,
      path,
    };

    return (
      <KeyboardConsumer>
        {({ open }) => !open && (
          <Fragment>
            <Portal name={TAB_BAR_BEFORE} props={{ ...props }} />
            {/* eslint-disable-next-line extra-rules/no-single-line-objects */}
            <Portal name={TAB_BAR} props={{ tabs: { ...tabs }, ...props }}>
              <Grid className={styles} data-test-id="tabBar" role="tablist" component="div">
                {visibleTabs.map(tab => createTabAction(tab, activeTab === tab.type, path))}
              </Grid>
            </Portal>
            <Portal name={TAB_BAR_AFTER} props={{ ...props }} />
          </Fragment>
        )}
      </KeyboardConsumer>
    );
  }
}

export default connect(TabBar);
