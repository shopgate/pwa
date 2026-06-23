import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { makeStyles } from '@shopgate/engage/styles';
import BrowseIcon from '@shopgate/pwa-ui-shared/icons/BrowseIcon';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import connect from '../connector';

const useIconStyles = makeStyles()({
  icon: {
    height: 32,
    width: 31,
  },
});

/**
 * The tab bar browse action.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TabBarBrowseAction = (props) => {
  const { classes } = useIconStyles();
  const { historyPush } = props;
  const handleClick = useCallback(() => {
    historyPush({ pathname: BROWSE_PATH });
  }, [historyPush]);

  return (
    <>
      <Portal
        name={portals.TAB_BAR_BROWSE_BEFORE}
        props={{
          ...props,
          TabBarAction,
        }}
      />
      <Portal
        name={portals.TAB_BAR_BROWSE}
        props={{
          ...props,
          TabBarAction,
        }}
      >
        <TabBarAction
          {...props}
          icon={(
            <Portal name={portals.TAB_BAR_BROWSE_ICON}>
              <BrowseIcon className={classes.icon} />
            </Portal>
          )}
          onClick={handleClick}
        />
      </Portal>
      <Portal
        name={portals.TAB_BAR_BROWSE_AFTER}
        props={{
          ...props,
          TabBarAction,
        }}
      />
    </>
  );
};

TabBarBrowseAction.propTypes = {
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  ...TabBarAction.propTypes,
};

TabBarBrowseAction.defaultProps = TabBarAction.defaultProps;

export default connect(memo(TabBarBrowseAction));
