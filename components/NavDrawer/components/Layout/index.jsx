import React from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import Drawer from '@shopgate/pwa-common/components/Drawer';
import styles from './style';

/**
 * The Layout component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Layout = props => (
  <Portal isOpened>
    <section data-test-id="NavDrawer">
      <Backdrop
        isVisible={props.active}
        level={3}
        onClick={props.close}
        opacity={20}
      />
      <Drawer
        alwaysActive
        className={styles.container}
        isOpen={props.active}
        animation={styles.drawerAnimation}
      >
        <div className={styles.content} ref={props.setContentRef}>
          {props.children}
        </div>
      </Drawer>
    </section>
  </Portal>
);

Layout.propTypes = {
  close: PropTypes.func.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node,
  setContentRef: PropTypes.func,
};

Layout.defaultProps = {
  children: null,
  active: false,
  setContentRef: () => {},
};

export default Layout;
