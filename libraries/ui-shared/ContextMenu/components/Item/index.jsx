import React from 'react';
import PropTypes from 'prop-types';
import compose from 'lodash/fp/compose';
import Glow from '../../../Glow';
import { getItemClass } from './style';

/**
 * A delay in ms after that the closeMenu callback gets triggered.
 * @type {number}
 */
const CLOSE_DELAY = 250;

/**
 * The Context Menu Item component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Item = ({
  children, closeMenu, onClick, disabled,
}) => {
  const handleClick = compose(
    onClick,
    () => setTimeout(closeMenu, CLOSE_DELAY)
  );

  return (
    <Glow disabled={disabled}>
      <div
        className={getItemClass(disabled)}
        onClick={disabled ? () => {} : handleClick}
        aria-hidden
        data-test-id="contextMenuButton"
      >
        {children}
      </div>
    </Glow>
  );
};

Item.propTypes = {
  children: PropTypes.node,
  closeMenu: PropTypes.func,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Item.defaultProps = {
  children: null,
  closeMenu: () => {},
  onClick: () => {},
  disabled: false,
};

export default Item;
