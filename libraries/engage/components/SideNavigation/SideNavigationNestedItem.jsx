import React, {
  useState, useCallback, useMemo, useEffect,
} from 'react';
import ArrowDrop from '@shopgate/pwa-ui-shared/icons/ArrowDropIcon';
import PropTypes from 'prop-types';
import {
  chevronButton, chevronUp, chevronDown, open,
} from './SideNavigationCategoriesItem.style';
import SideNavigationItem from './SideNavigationItem';

/**
 * The SideNavigationCategoriesItem component
 * @param {Object} props The component props.
 * @param {number} props.level The nesting level.
 * @param {string} props.label The item label.
 * @param {string} props.href The item href.
 * @param {JSX.Element} props.children The nested items.
 * @param {boolean} props.forceActive Whether the item should be forced open.
 * @returns {JSX.Element}
 */
const SideNavigationNestedItem = ({
  level,
  label,
  href,
  children,
  forceActive,
}) => {
  const [isOpen, setIsOpen] = useState(forceActive);

  useEffect(() => {
    if (forceActive) {
      setIsOpen(true);
    }
  }, [forceActive]);

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const buttonRight = useMemo(() => (
    <button type="button" onClick={handleClick} className={chevronButton}>
      <ArrowDrop className={(isOpen ? chevronUp : chevronDown).toString()} />
    </button>
  ), [handleClick, isOpen]);

  return (
    <SideNavigationItem
      href={href}
      label={label}
      level={level}
      buttonRight={buttonRight}
      className={level === 0 && isOpen ? open : null}
      forceInactive
    >
      {isOpen ? children : null}
    </SideNavigationItem>
  );
};

SideNavigationNestedItem.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  forceActive: PropTypes.bool,
  level: PropTypes.number,
};

SideNavigationNestedItem.defaultProps = {
  level: 0,
  forceActive: false,
};

export default SideNavigationNestedItem;
