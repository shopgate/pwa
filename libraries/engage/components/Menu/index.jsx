import React, {
  Children, useMemo, cloneElement,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { ConnectedReactPortal } from '@shopgate/engage/components';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Position from './components/Position';
import Item from './components/Item';

const useStyles = makeStyles()(theme => ({
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: theme.spacing(1, 0),
    minWidth: 130,
    background: themeConfig.colors.light,
    borderRadius: 2,
    boxShadow: themeConfig.shadows.contextMenu,
  },
}));

/**
 * The Menu component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Menu = ({
  children,
  contextRef,
  isOpen,
  onClose,
}) => {
  const { classes } = useStyles();

  const offset = useMemo(() => {
    if (contextRef?.current) {
      const bounds = contextRef.current.getBoundingClientRect();
      return {
        height: bounds.height,
        width: bounds.width,
        left: bounds.left,
        right: bounds.right,
        bottom: bounds.bottom,
        top: bounds.top + bounds.height,
      };
    }

    return {
      top: 0,
      left: 0,
    };
  }, [contextRef]);

  return (
    <ConnectedReactPortal isOpened={isOpen}>
      <div className={classes.overlay}>
        <Backdrop isVisible level={0} opacity={0} onClick={onClose} />
        <Position offset={offset}>
          <div className={classes.menu}>
            {Children.map(children, (child) => {
              if (!child) {
                return null;
              }

              return cloneElement(child, { closeMenu: onClose });
            })}
          </div>
        </Position>
      </div>
    </ConnectedReactPortal>
  );
};

Menu.Item = Item;

Menu.propTypes = {
  children: PropTypes.node,
  contextRef: PropTypes.shape(),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

Menu.defaultProps = {
  children: null,
  contextRef: null,
  isOpen: false,
  onClose: () => {},
};

export default Menu;
