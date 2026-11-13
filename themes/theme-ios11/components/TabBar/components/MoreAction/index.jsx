import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { makeStyles } from '@shopgate/engage/styles';
import MoreIcon from '@shopgate/pwa-ui-shared/icons/MoreIcon';
import { MORE_PATH } from 'Pages/More/constants';
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
 * The tab bar more action.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TabBarMoreAction = ({ configuredIcon: ConfiguredIcon, portalsOnly, ...props }) => {
  const { classes } = useIconStyles();
  const { historyPush } = props;
  const handleClick = useCallback(() => {
    historyPush({ pathname: MORE_PATH });
  }, [historyPush]);

  const portalProps = {
    ...props,
    TabBarAction,
  };
  const before = <Portal name={portals.TAB_BAR_MORE_BEFORE} props={portalProps} />;
  const after = <Portal name={portals.TAB_BAR_MORE_AFTER} props={portalProps} />;

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
        name={portals.TAB_BAR_MORE}
        props={portalProps}
      >
        <TabBarAction
          {...props}
          icon={(
            <Portal name={portals.TAB_BAR_MORE_ICON}>
              {ConfiguredIcon
                ? <TabBarIcon icon={ConfiguredIcon} />
                : <MoreIcon className={classes.icon} />}
            </Portal>
          )}
          onClick={handleClick}
        />
      </Portal>
      {after}
    </>
  );
};

TabBarMoreAction.propTypes = {
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  ...TabBarAction.propTypes,
  configuredIcon: PropTypes.elementType,
  portalsOnly: PropTypes.bool,
};

TabBarMoreAction.defaultProps = {
  ...TabBarAction.defaultProps,
  configuredIcon: null,
  portalsOnly: false,
};

export default connect(memo(TabBarMoreAction));
