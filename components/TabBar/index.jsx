import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import KeyboardConsumer from '@shopgate/pwa-common/components/KeyboardConsumer';
import getTabActionComponentForType from './helpers/getTabActionComponentForType';
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
 * Renders the tab bar component.
 * @param {Object} props The component properties.
 * @param {boolean} props.isVisible Whether the tab bar is visible.
 * @param {Array} props.visibleTabs The visible tabs.
 * @param {string|null} props.activeTab The currently active tab name.
 * @returns {JSX}
 */
const TabBar = ({
  isVisible,
  activeTab,
  path,
}) => {
  updateHeightCSSProperty(isVisible);

  if (!isVisible) {
    return null;
  }

  return (
    <KeyboardConsumer>
      {({ open }) => !open && (
        <div data-test-id="tabBar">
          <Grid className={styles}>
            {visibleTabs.map(tab => createTabAction(tab, activeTab === tab.type, path))}
          </Grid>
        </div>
      )}
    </KeyboardConsumer>
  );
};

TabBar.propTypes = {
  path: PropTypes.string.isRequired,
  activeTab: PropTypes.string,
  isVisible: PropTypes.bool,
};

TabBar.defaultProps = {
  activeTab: null,
  isVisible: true,
};

export default connect(TabBar);
