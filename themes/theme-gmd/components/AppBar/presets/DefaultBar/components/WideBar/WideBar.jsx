import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { AppBar } from '@shopgate/pwa-ui-material';
import { ResponsiveContainer, Logo } from '@shopgate/engage/components';
import { GlobalLocationSwitcher, FulfillmentSlotSwitcher } from '@shopgate/engage/locations';
import { MAX_DESKTOP_WIDTH, DESKTOP_MENU_BAR_HEIGHT } from '../../../../../../constants';
import Search from './Search';
import Cart from './Cart';
import connect from './WideBar.connector';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  root: {
    height: DESKTOP_MENU_BAR_HEIGHT,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterBox: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    overflow: 'hidden',
    maxWidth: MAX_DESKTOP_WIDTH,
    height: `calc(${DESKTOP_MENU_BAR_HEIGHT}px - ${variables.gap.small}px)`,
    justifyContent: 'flex-end',
    flexGrow: 1,
    padding: '0 12px',
  },
  logo: {
    padding: `${variables.gap.small - 1}px 0`,
    display: 'block',
    cursor: 'pointer',
    flex: 0,
    order: 1,
    ' img': {
      maxHeight: 42,
    },
  },
  right: {
    padding: `${variables.gap.small - 1}px 0`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 'auto',
  },
});

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
}) => {
  const { classes } = useStyles();

  return (
    <AppBar
      {...props}
      backgroundColor={backgroundColor}
      textColor={textColor}
      left={null}
      center={(
        <div className={classes.root}>
          <div className={classes.letterBox}>
            <Logo onClick={navigate} className={classes.logo} />
            <div className={classes.right}>
              <GlobalLocationSwitcher />
              <FulfillmentSlotSwitcher />
              <Search />
              <Cart />
            </div>
          </div>
        </div>
        )}
      right={null}
      below={
        <>
          <ResponsiveContainer breakpoint="xs" appAlways>
            <div id="PageHeaderBelow" />
          </ResponsiveContainer>
          <ResponsiveContainer breakpoint=">xs" webOnly>
            <div id="PageHeaderProgress" />
          </ResponsiveContainer>
        </>
      }
    />
  );
};

WideBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  textColor: PropTypes.string.isRequired,
};

WideBar.defaultProps = {
};

export default connect(WideBar);
