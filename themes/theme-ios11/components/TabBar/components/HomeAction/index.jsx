import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { makeStyles } from '@shopgate/engage/styles';
import HomeIcon from '@shopgate/pwa-ui-ios/icons/HomeIcon';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
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
const TabBarHomeAction = (props) => {
  const { classes } = useIconStyles();
  const { historyPush } = props;
  const handleClick = useCallback(() => {
    historyPush({ pathname: INDEX_PATH });
  }, [historyPush]);

  return (
    <>
      <Portal
        name={portals.TAB_BAR_HOME_BEFORE}
        props={{
          ...props,
          TabBarAction,
        }}
      />
      <Portal
        name={portals.TAB_BAR_HOME}
        props={{
          ...props,
          TabBarAction,
        }}
      >
        <TabBarAction
          {...props}
          icon={(
            <Portal name={portals.TAB_BAR_HOME_ICON}>
              <HomeIcon className={classes.icon} />
            </Portal>
          )}
          onClick={handleClick}
        />
      </Portal>
      <Portal
        name={portals.TAB_BAR_HOME_AFTER}
        props={{
          ...props,
          TabBarAction,
        }}
      />
    </>
  );
};

TabBarHomeAction.propTypes = {
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  ...TabBarAction.propTypes,
};

TabBarHomeAction.defaultProps = TabBarAction.defaultProps;

export default connect(memo(TabBarHomeAction));
