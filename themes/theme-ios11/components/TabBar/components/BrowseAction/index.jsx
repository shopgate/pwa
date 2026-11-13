import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { UIEvents } from '@shopgate/engage/core/events';
import { OPEN_CATEGORY_DRAWER } from '@shopgate/engage/navigation/constants';
import { makeStyles } from '@shopgate/engage/styles';
import BrowseIcon from '@shopgate/pwa-ui-shared/icons/BrowseIcon';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import TabBarIcon from '../TabBarIcon';
import connect from '../connector';

const useIconStyles = makeStyles()({
  icon: {
    height: 32,
    width: 31,
  },
});

/**
 * The tab bar browse action. Also renders the categoryDrawer item, which opens the category drawer
 * instead of the browse page.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TabBarBrowseAction = ({
  configuredIcon: ConfiguredIcon,
  opensCategoryDrawer,
  portalsOnly,
  ...props
}) => {
  const { classes } = useIconStyles();
  const { historyPush } = props;
  const handleClick = useCallback(() => {
    if (opensCategoryDrawer) {
      UIEvents.emit(OPEN_CATEGORY_DRAWER);
      return;
    }

    historyPush({ pathname: BROWSE_PATH });
  }, [historyPush, opensCategoryDrawer]);

  const portalProps = {
    ...props,
    TabBarAction,
  };
  const before = <Portal name={portals.TAB_BAR_BROWSE_BEFORE} props={portalProps} />;
  const after = <Portal name={portals.TAB_BAR_BROWSE_AFTER} props={portalProps} />;

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
        name={portals.TAB_BAR_BROWSE}
        props={portalProps}
      >
        <TabBarAction
          {...props}
          icon={(
            <Portal name={portals.TAB_BAR_BROWSE_ICON}>
              {ConfiguredIcon
                ? <TabBarIcon icon={ConfiguredIcon} />
                : <BrowseIcon className={classes.icon} />}
            </Portal>
          )}
          onClick={handleClick}
        />
      </Portal>
      {after}
    </>
  );
};

TabBarBrowseAction.propTypes = {
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  ...TabBarAction.propTypes,
  configuredIcon: PropTypes.elementType,
  opensCategoryDrawer: PropTypes.bool,
  portalsOnly: PropTypes.bool,
};

TabBarBrowseAction.defaultProps = {
  ...TabBarAction.defaultProps,
  configuredIcon: null,
  opensCategoryDrawer: false,
  portalsOnly: false,
};

export default connect(memo(TabBarBrowseAction));
