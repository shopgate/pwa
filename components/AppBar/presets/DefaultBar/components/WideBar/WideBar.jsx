import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { AppBar } from '@shopgate/pwa-ui-material';
import Logo from 'Components/Logo';
import { MAX_DESKTOP_WIDTH } from '../../../../../../constants';
import Search from './Search';
import Cart from './Cart';
import connect from './WideBar.connector';

const styles = {
  root: css({
    height: 56,
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
      maxHeight: 56 - 24,
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
  below,
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
            <Search />
            <Cart />
          </div>
        </div>
      </div>
      )}
    right={null}
    below={below}
  />
);

WideBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  textColor: PropTypes.string.isRequired,
  below: PropTypes.element,
};

WideBar.defaultProps = {
  below: null,
};

export default connect(WideBar);
