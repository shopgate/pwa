import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from './debounce';
import ownerWindow from './ownerWindow';
import TabIndicator from './TabIndicator';
import useEventCallback from './useEventCallback';
import {
  root, fixed, flexContainer,
} from './Tabs.style';

/**
 * C
 * @param {Object} props props
 * @returns {JSX}
 */
const Tabs = (props) => {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    children: childrenProp,
    classes,
    className,
    component: Component = 'div',
    onChange,
    orientation = 'horizontal',
    selectionFollowsFocus,
    TabIndicatorProps = {},
    textColor = 'inherit',
    value,
    variant = 'standard',
    ...other
  } = props;
  const vertical = orientation === 'vertical';

  const start = vertical ? 'top' : 'left';
  const size = vertical ? 'height' : 'width';

  const [mounted, setMounted] = React.useState(false);
  const [indicatorStyle, setIndicatorStyle] = React.useState({});

  const valueToIndex = new Map();
  const tabsRef = React.useRef(null);
  const tabListRef = React.useRef(null);

  /**
   * Get Tabs Meta
   * @returns {Object}
   */
  const getTabsMeta = () => {
    const tabsNode = tabsRef.current;
    let tabsMeta;
    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect();
      // create a new object with ClientRect class props + scrollLeft
      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
      };
    }

    let tabMeta;
    if (tabsNode && value !== false) {
      const { children } = tabListRef.current;

      if (children.length > 0) {
        const tab = children[valueToIndex.get(value)];
        tabMeta = tab ? tab.getBoundingClientRect() : null;
      }
    }
    return {
      tabsMeta,
      tabMeta,
    };
  };

  const updateIndicatorState = useEventCallback(() => {
    const { tabsMeta, tabMeta } = getTabsMeta();
    let startValue = 0;

    if (tabMeta && tabsMeta) {
      startValue = tabMeta.left - tabsMeta.left;
    }

    const newIndicatorStyle = {
      [start]: startValue,
      // May be wrong until the font is loaded.
      [size]: tabMeta ? tabMeta[size] : 0,
    };

    // IE 11 support, replace with Number.isNaN
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(indicatorStyle[start]) || isNaN(indicatorStyle[size])) {
      setIndicatorStyle(newIndicatorStyle);
    } else {
      const dStart = Math.abs(indicatorStyle[start] - newIndicatorStyle[start]);
      const dSize = Math.abs(indicatorStyle[size] - newIndicatorStyle[size]);

      if (dStart >= 1 || dSize >= 1) {
        setIndicatorStyle(newIndicatorStyle);
      }
    }
  });

  React.useEffect(() => {
    const handleResize = debounce(() => {
      updateIndicatorState();
    });

    const win = ownerWindow(tabsRef.current);
    win.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      win.removeEventListener('resize', handleResize);
    };
  }, [updateIndicatorState]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    updateIndicatorState();
  });

  const indicator = (
    <TabIndicator
      style={{
        ...indicatorStyle,
        ...TabIndicatorProps.style,
      }}
    />
  );

  let childIndex = 0;
  const children = React.Children.map(childrenProp, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const childValue = child.props.value === undefined ? childIndex : child.props.value;
    valueToIndex.set(childValue, childIndex);
    const selected = childValue === value;

    childIndex += 1;
    return React.cloneElement(child, {
      fullWidth: variant === 'fullWidth',
      indicator: selected && !mounted && indicator,
      selected,
      selectionFollowsFocus,
      onChange,
      textColor,
      value: childValue,
    });
  });

  /**
   * Handle Key down
   * @param {Object} event event
   */
  const handleKeyDown = (event) => {
    const { target } = event;
    // Keyboard navigation assumes that [role="tab"] are siblings
    // though we might warn in the future about nested, interactive elements
    // as a a11y violation
    const role = target.getAttribute('role');
    if (role !== 'tab') {
      return;
    }

    let newFocusTarget = null;
    let previousItemKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    let nextItemKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (orientation === 'horizontal' && true) {
      // swap previousItemKey with nextItemKey
      previousItemKey = 'ArrowRight';
      nextItemKey = 'ArrowLeft';
    }

    switch (event.key) {
      case previousItemKey:
        newFocusTarget = target.previousElementSibling || tabListRef.current.lastChild;
        break;
      case nextItemKey:
        newFocusTarget = target.nextElementSibling || tabListRef.current.firstChild;
        break;
      case 'Home':
        newFocusTarget = tabListRef.current.firstChild;
        break;
      case 'End':
        newFocusTarget = tabListRef.current.lastChild;
        break;
      default:
        break;
    }

    if (newFocusTarget !== null) {
      newFocusTarget.focus();
      event.preventDefault();
    }
  };

  return (
    <Component
      className={classNames(
        root,
        className
      )}
      {...other}
    >
      <div
        className={classNames(fixed)}
        ref={tabsRef}
      >
        {/* The tablist isn't interactive but the tabs are */}
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
        <div
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={classNames(flexContainer)}
          onKeyDown={handleKeyDown}
          ref={tabListRef}
          role="tablist"
        >
          {children}
        </div>
        {mounted && indicator}
      </div>
    </Component>
  );
};

Tabs.propTypes = {
  'aria-label': PropTypes.string.isRequired,
  'aria-labelledby': PropTypes.string.isRequired,
  centered: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape().isRequired,
  className: PropTypes.string.isRequired,
  component: PropTypes.elementType.isRequired,
  indicatorColor: PropTypes.oneOf(['primary', 'secondary']).isRequired,
  onChange: PropTypes.func.isRequired,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  selectionFollowsFocus: PropTypes.bool.isRequired,
  TabIndicatorProps: PropTypes.shape().isRequired,
  textColor: PropTypes.oneOf(['inherit', 'primary', 'secondary']).isRequired,
  value: PropTypes.shape().isRequired,
  variant: PropTypes.oneOf(['fullWidth', 'standard']).isRequired,
};

export default Tabs;
