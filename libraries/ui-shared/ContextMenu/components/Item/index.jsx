import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { makeStyles } from '@shopgate/engage/styles';
import Glow from '../../../Glow';
import { useContextMenu } from '../../ContextMenu.hooks';

const CLOSE_DELAY = 250;

const useStyles = makeStyles()((theme, { disabled }) => ({
  root: {
    position: 'relative',
    whiteSpace: 'nowrap',
    marginBottom: 2,
    padding: theme.spacing(1.25, 2.75),
    zIndex: 1,
    color: disabled ? theme.palette.text.secondary : 'inherit',
    ...(!disabled ? {
      cursor: 'pointer',
      '&:hover': {
        background: theme.alpha(theme.palette.primary.main, 0.04),
      },
    } : {
      cursor: 'default',
    }),
  },
}));

/**
 * The Context Menu Item component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Item = ({
  children, onClick, disabled, autoClose, className,
}) => {
  const { classes, cx } = useStyles({ disabled });
  const { handleMenuToggle } = useContextMenu();

  const handleClick = useCallback((event) => {
    event.persist();
    setTimeout(() => {
      if (autoClose) {
        handleMenuToggle(event);
      }

      setTimeout(() => {
        onClick(event);
      }, 0);
    }, autoClose ? CLOSE_DELAY : 0);
  }, [autoClose, handleMenuToggle, onClick]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  }, [handleClick]);

  return (
    <Glow disabled={disabled}>
      <div
        className={cx(classes.root, className)}
        onClick={disabled ? noop : handleClick}
        data-test-id="contextMenuButton"
        aria-disabled={disabled}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={!disabled ? handleKeyPress : undefined}
      >
        {children}
      </div>
    </Glow>
  );
};

Item.propTypes = {
  autoClose: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Item.defaultProps = {
  autoClose: true,
  children: null,
  className: '',
  onClick: () => {},
  disabled: false,
};

export default Item;
