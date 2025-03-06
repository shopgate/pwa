import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import classNames from 'classnames';
import Glow from '../../../Glow';
import { getItemClass } from './style';
import { useContextMenu } from '../../ContextMenu.hooks';

/**
 * A delay in ms after that the closeMenu callback gets triggered.
 * @type {number}
 */
const CLOSE_DELAY = 250;

/**
 * The Context Menu Item component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Item = ({
  children, onClick, disabled, autoClose, className,
}) => {
  const { handleMenuToggle } = useContextMenu();

  const [onClickTriggerIsOutstanding, setOnClickTriggerIsOutstanding] = useState(false);

  /**
    * Handles the click event.
    * @param {Event} event The click event.
    * @returns {void}
    */
  const handleClick = (event) => {
    event.persist();
    return setTimeout(() => {
      setOnClickTriggerIsOutstanding(true);
      if (autoClose) {
        handleMenuToggle(event);
      }
    }, CLOSE_DELAY);
  };

  // This is a workaround to trigger the click event after the handleMenuToggle has been called.
  // This is necessary because we have to wait for the menu to
  // be closed so that the FocusTrap disappears.
  // Therefore we have to wait for the component to be unmounted to trigger the click event.
  useEffect(() => () => {
    if (onClickTriggerIsOutstanding) {
      setTimeout(() => {
        onClick();
      }, 0);
    }
  }, [onClickTriggerIsOutstanding, onClick]);

  return (
    <Glow disabled={disabled}>
      <button
        className={classNames(getItemClass(disabled), className)}
        onClick={disabled ? noop : handleClick}
        data-test-id="contextMenuButton"
        type="button"
        disabled={disabled}
      >
        {children}
      </button>
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
