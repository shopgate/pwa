import React, {
  useState, useCallback, useMemo, useEffect,
} from 'react';
import ArrowDrop from '@shopgate/pwa-ui-shared/icons/ArrowDropIcon';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import SideNavigationItem from './SideNavigationItem';

const useStyles = makeStyles()(theme => ({
  chevronButton: {
    flexShrink: 0,
    outline: 0,
    margin: theme.spacing(0, -2, 0, 1),
    fontSize: '1.6em',
    color: '#373D41',
    position: 'relative',
  },
  chevronDown: {
    transformOrigin: 'center center',
    transition: 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    transform: 'rotateZ(0deg)',
  },
  chevronUp: {
    transformOrigin: 'center center',
    transition: 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    transform: 'rotateZ(180deg)',
  },
  open: {},
}));

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
  const { classes } = useStyles();
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
    <button type="button" onClick={handleClick} className={classes.chevronButton}>
      <ArrowDrop className={isOpen ? classes.chevronUp : classes.chevronDown} />
    </button>
  ), [classes.chevronButton, classes.chevronDown, classes.chevronUp, handleClick, isOpen]);

  return (
    <SideNavigationItem
      href={href}
      label={label}
      level={level}
      buttonRight={buttonRight}
      className={level === 0 && isOpen ? classes.open : null}
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
