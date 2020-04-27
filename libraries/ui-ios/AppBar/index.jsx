import React, { useMemo, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
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
 * The AppBar component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBar = ({
  below,
  center,
  left,
  right,
  classes,
  'aria-hidden': ariaHidden,
  backgroundColor,
  textColor,
}) => {
  const contentRef = useRef(null);
  const style = useMemo(() => ({
    background: backgroundColor,
    color: textColor,
  }), [backgroundColor, textColor]);

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

  const sectionClasses = classnames(styles.outer, classes.outer);

  return (
    <section
      className={sectionClasses}
      data-test-id="Navigator"
      style={style}
      aria-hidden={ariaHidden}
      ref={contentRef}
    >
      <div className={classnames(styles.inner, classes.inner)}>
        <Left elements={left} />
        <Center elements={center} />
        <Right elements={right} />
      </div>
      <Below elements={below} />
    </section>
  );
};

AppBar.propTypes = {
  'aria-hidden': PropTypes.bool,
  backgroundColor: PropTypes.string,
  below: PropTypes.node,
  center: PropTypes.node,
  classes: PropTypes.shape({
    inner: PropTypes.string,
    outer: PropTypes.string,
  }),
  left: PropTypes.node,
  right: PropTypes.node,
  textColor: PropTypes.string,
};

AppBar.defaultProps = {
  'aria-hidden': null,
  backgroundColor: themeColors.light,
  below: null,
  center: null,
  classes: {
    inner: '',
    outer: '',
  },
  left: null,
  right: null,
  textColor: themeColors.dark,
};

AppBar.Field = Field;
AppBar.Icon = Icon;
AppBar.Title = Title;

export default AppBar;
