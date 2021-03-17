import React from 'react';
import PropTypes from 'prop-types';
import compose from 'lodash/fp/compose';
import noop from 'lodash/noop';
import classNames from 'classnames';
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
  children, closeMenu, onClick, disabled, autoClose, className,
}) => {
  const handleClick = compose(
    onClick,
    autoClose ? () => setTimeout(closeMenu, CLOSE_DELAY) : noop
  );

  return (
    <Glow disabled={disabled}>
      <div
        className={classNames(getItemClass(disabled), className)}
        onClick={disabled ? noop : handleClick}
        aria-hidden
        data-test-id="contextMenuButton"
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
  closeMenu: PropTypes.func,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Item.defaultProps = {
  autoClose: true,
  children: null,
  className: '',
  closeMenu: () => {},
  onClick: () => {},
  disabled: false,
};

export default Item;
