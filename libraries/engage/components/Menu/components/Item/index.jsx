import React, { useCallback } from 'react';
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

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  }, [handleClick]);

  return (
    <Glow>
      <div
        className={getItemClass()}
        onClick={handleClick}
        role="button"
        data-test-id="contextMenuButton"
        onKeyDown={handleKeyPress}
        tabIndex={0}
      >
        {children}
      </div>
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
