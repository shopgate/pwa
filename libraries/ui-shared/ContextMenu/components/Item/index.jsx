import React from 'react';
import PropTypes from 'prop-types';
import compose from 'lodash/fp/compose';
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
  const handleClick = compose(
    onClick,
    autoClose ? event => setTimeout(() => {
      handleMenuToggle(event);
    }, CLOSE_DELAY) : noop
  );

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
