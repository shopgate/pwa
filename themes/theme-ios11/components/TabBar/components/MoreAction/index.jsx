import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { makeStyles } from '@shopgate/engage/styles';
import MoreIcon from '@shopgate/pwa-ui-shared/icons/MoreIcon';
import { MORE_PATH } from 'Pages/More/constants';
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
 * The tab bar more action.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TabBarMoreAction = (props) => {
  const { classes } = useIconStyles();
  const { historyPush } = props;
  const handleClick = useCallback(() => {
    historyPush({ pathname: MORE_PATH });
  }, [historyPush]);

  return (
    <>
      <Portal
        name={portals.TAB_BAR_MORE_BEFORE}
        props={{
          ...props,
          TabBarAction,
        }}
      />
      <Portal
        name={portals.TAB_BAR_MORE}
        props={{
          ...props,
          TabBarAction,
        }}
      >
        <TabBarAction
          {...props}
          icon={(
            <Portal name={portals.TAB_BAR_MORE_ICON}>
              <MoreIcon className={classes.icon} />
            </Portal>
          )}
          onClick={handleClick}
        />
      </Portal>
      <Portal
        name={portals.TAB_BAR_MORE_AFTER}
        props={{
          ...props,
          TabBarAction,
        }}
      />
    </>
  );
};

TabBarMoreAction.propTypes = {
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  ...TabBarAction.propTypes,
};

TabBarMoreAction.defaultProps = TabBarAction.defaultProps;

export default connect(memo(TabBarMoreAction));
