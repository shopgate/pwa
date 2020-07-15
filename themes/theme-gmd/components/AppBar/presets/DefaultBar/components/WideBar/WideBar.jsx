import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { AppBar } from '@shopgate/pwa-ui-material';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { GlobalLocationSwitcher } from '@shopgate/engage/locations';
import Logo from 'Components/Logo';
import { MAX_DESKTOP_WIDTH, DESKTOP_MENU_BAR_HEIGHT } from '../../../../../../constants';
import Search from './Search';
import Cart from './Cart';
import connect from './WideBar.connector';

const styles = {
  root: css({
    height: DESKTOP_MENU_BAR_HEIGHT,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }).toString(),
  letterBox: css({
    flex: 1,
    padding: '0 12px',
    maxWidth: MAX_DESKTOP_WIDTH,
    display: 'flex',
    flexDirection: 'row',
  }).toString(),
  logo: css({
    display: 'block',
    cursor: 'pointer',
    flex: 0,
    ' img': {
      maxHeight: 42,
    },
  }).toString(),
  right: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }).toString(),
};

/**
 * Renders a wide app bar for desktop and tablets.
 * @param {Object} props Component props.
 * @returns {JSX}
 */
const WideBar = ({
  backgroundColor,
  textColor,
  navigate,
  ...props
}) => (
  <AppBar
    {...props}
    backgroundColor={backgroundColor}
    textColor={textColor}
    left={null}
    center={(
      <div className={styles.root}>
        <div className={styles.letterBox}>
          <Logo onClick={navigate} className={styles.logo} />
          <div className={styles.right}>
            <GlobalLocationSwitcher />
            <Search />
            <Cart />
          </div>
        </div>
      </div>
      )}
    right={null}
    below={
      <Fragment>
        <ResponsiveContainer breakpoint="xs" appAlways>
          <div id="PageHeaderBelow" />
        </ResponsiveContainer>
        <ResponsiveContainer breakpoint=">xs" webOnly>
          <div id="PageHeaderProgress" />
        </ResponsiveContainer>
      </Fragment>
    }
  />
);

WideBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  textColor: PropTypes.string.isRequired,
};

WideBar.defaultProps = {
};

export default connect(WideBar);
