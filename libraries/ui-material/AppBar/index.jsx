import React, { useMemo, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';
import { setCSSCustomProp } from '@shopgate/engage/styles';
import Field from './components/Field';
import Icon from './components/Icon';
import Title from './components/Title';
import Right from './components/Right';
import Center from './components/Center';
import Left from './components/Left';
import Below from './components/Below';
import styles from './style';

/**
 * Updates the --app-bar-height custom property
 * @param {Object} ref The app bar ref.
 */
const updateAppBarHeight = (ref) => {
  if (!ref.current) {
    return;
  }

  setCSSCustomProp('--app-bar-height', `${getAbsoluteHeight(ref.current)}px`);
};

/**
 * The AppBar component
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBar = ({
  below,
  center,
  left,
  right,
  backgroundColor,
  textColor,
  shadow,
}) => {
  const contentRef = useRef(null);
  const style = useMemo(() => ({
    background: backgroundColor,
    color: textColor,
    boxShadow: !shadow ? 'none' : themeShadows.material,
  }), [backgroundColor, shadow, textColor]);

  const observer = useMemo(() => new MutationObserver(() => {
    updateAppBarHeight(contentRef);
  }), [contentRef]);

  useLayoutEffect(() => {
    updateAppBarHeight(contentRef);
    observer.observe(contentRef.current, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, [contentRef, observer]);

  return (
    <header
      ref={contentRef}
      className={`${styles.outer} ui-material__app-bar`}
      data-test-id="Navigator"
      role="banner"
      style={style}
    >
      <div className={styles.inner}>
        <Left elements={left} />
        <Center elements={center} />
        <Right elements={right} />
      </div>
      <Below elements={below} />
    </header>
  );
};

AppBar.propTypes = {
  backgroundColor: PropTypes.string,
  below: PropTypes.node,
  center: PropTypes.node,
  left: PropTypes.node,
  right: PropTypes.node,
  shadow: PropTypes.bool,
  textColor: PropTypes.string,
};

AppBar.defaultProps = {
  backgroundColor: themeColors.light,
  below: null,
  center: null,
  left: null,
  right: null,
  shadow: true,
  textColor: themeColors.dark,
};

AppBar.Field = Field;
AppBar.Icon = Icon;
AppBar.Title = Title;

export default AppBar;
