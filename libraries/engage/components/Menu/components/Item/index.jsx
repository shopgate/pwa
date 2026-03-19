import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import compose from 'lodash/fp/compose';
import Glow from '@shopgate/pwa-ui-shared/Glow';
import Color from 'color';
import { makeStyles, getCSSCustomProp } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const useStyles = makeStyles()((_, { background }) => ({
  item: {
    position: 'relative',
    whiteSpace: 'nowrap',
    padding: `${themeConfig.variables.gap.big * 0.875}px ${themeConfig.variables.gap.big * 1.375}px`,
    lineHeight: 1,
    zIndex: 1,
    cursor: 'pointer',
    ':hover': {
      background,
    },
  },
}));

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
  let background = themeConfig.colors.shade8;
  const customPropColor = getCSSCustomProp('--color-primary');

  if (customPropColor) {
    background = Color(customPropColor).alpha(0.04).toString();
  }

  const { classes } = useStyles({ background });

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
        className={classes.item}
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
