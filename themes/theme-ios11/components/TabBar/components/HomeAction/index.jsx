import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { makeStyles } from '@shopgate/engage/styles';
import HomeIcon from '@shopgate/pwa-ui-ios/icons/HomeIcon';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import TabBarIcon from '../TabBarIcon';
import connect from '../connector';

const useIconStyles = makeStyles()({
  icon: {
    height: 24,
    width: 24,
  },
});

/**
 * The TabBarHomeAction component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TabBarHomeAction = ({ configuredIcon: ConfiguredIcon, portalsOnly, ...props }) => {
  const { classes } = useIconStyles();
  const { historyPush } = props;
  const handleClick = useCallback(() => {
    historyPush({ pathname: INDEX_PATH });
  }, [historyPush]);

  const portalProps = {
    ...props,
    TabBarAction,
  };
  const before = <Portal name={portals.TAB_BAR_HOME_BEFORE} props={portalProps} />;
  const after = <Portal name={portals.TAB_BAR_HOME_AFTER} props={portalProps} />;

  if (portalsOnly) {
    return (
      <>
        {before}
        {after}
      </>
    );
  }

  return (
    <>
      {before}
      <Portal
        name={portals.TAB_BAR_HOME}
        props={portalProps}
      >
        <TabBarAction
          {...props}
          icon={(
            <Portal name={portals.TAB_BAR_HOME_ICON}>
              {ConfiguredIcon
                ? <TabBarIcon icon={ConfiguredIcon} />
                : <HomeIcon className={classes.icon} />}
            </Portal>
          )}
          onClick={handleClick}
        />
      </Portal>
      {after}
    </>
  );
};

TabBarHomeAction.propTypes = {
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  ...TabBarAction.propTypes,
  configuredIcon: PropTypes.elementType,
  portalsOnly: PropTypes.bool,
};

TabBarHomeAction.defaultProps = {
  ...TabBarAction.defaultProps,
  configuredIcon: null,
  portalsOnly: false,
};

export default connect(memo(TabBarHomeAction));
