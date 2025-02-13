import React from 'react';
import PropTypes from 'prop-types';
import compose from 'lodash/fp/compose';
import Glow from '@shopgate/pwa-ui-shared/Glow';
import { getItemClass } from './style';

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
const Item = ({ children, closeMenu, onClick }) => {
  const handleClick = compose(
    onClick,
    () => setTimeout(closeMenu, CLOSE_DELAY)
  );

  return (
    <Glow>
      <button
        className={getItemClass()}
        onClick={handleClick}
        type="button"
        data-test-id="contextMenuButton"
      >
        {children}
      </button>
    </Glow>
  );
};

Item.propTypes = {
  children: PropTypes.node,
  closeMenu: PropTypes.func,
  onClick: PropTypes.func,
};

Item.defaultProps = {
  children: null,
  closeMenu: () => {},
  onClick: () => {},
};

export default Item;
