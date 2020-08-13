import React, {
  useState, useCallback, useMemo, useEffect,
} from 'react';
import ArrowDrop from '@shopgate/pwa-ui-shared/icons/ArrowDropIcon';
import {
  chevronButton, chevronUp, chevronDown, open,
} from './SideNavigationCategoriesItem.style';
import SideNavigationItem from './SideNavigationItem';

/**
 * The SideNavigationCategoriesItem component
 * @returns {JSX}
 */
const SideNavigationNestedItem = ({
  level,
  label,
  href,
  children,
  forceActive,
}: Props) => {
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

SideNavigationNestedItem.defaultProps = {
  level: 0,
  forceActive: false,
};

export default SideNavigationNestedItem;
