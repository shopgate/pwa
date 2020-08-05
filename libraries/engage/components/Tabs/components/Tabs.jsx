import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from '../debounce';
import ownerWindow from '../ownerWindow';
import TabIndicator from './TabIndicator';
import useEventCallback from '../useEventCallback';
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
    children: childrenProp,
    className,
    onChange,
    value,
  } = props;

  const start = 'left';
  const size = 'width';

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
      style={indicatorStyle}
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
      indicator: selected && !mounted && indicator,
      selected,
      onChange,
      value: childValue,
    });
  });

  return (
    <div
      className={classNames(
        root,
        className
      )}
    >
      <div
        className={classNames(fixed)}
        ref={tabsRef}
      >
        <div
          className={classNames(flexContainer)}
          ref={tabListRef}
          role="tablist"
        >
          {children}
        </div>
        {mounted && indicator}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Tabs.defaultProps = {
  className: null,
};

export default Tabs;
