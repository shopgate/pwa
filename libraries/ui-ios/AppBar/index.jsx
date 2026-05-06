import React, { useMemo, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { makeStyles, setCSSCustomProp } from '@shopgate/engage/styles';
import { SurroundPortals } from '@shopgate/engage/components';
import { APP_BAR_CONTENT } from '@shopgate/engage/core/constants';
import Field from './components/Field';
import Icon from './components/Icon';
import Title from './components/Title';
import Right from './components/Right';
import Center from './components/Center';
import Left from './components/Left';
import Below from './components/Below';

const useStyles = makeStyles()({
  outer: {
    boxSizing: 'content-box',
    minHeight: 44,
    paddingTop: 'var(--safe-area-inset-top)',
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
});

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
  classes: parentClasses,
  'aria-hidden': ariaHidden,
  backgroundColor,
  textColor,
}) => {
  const { classes, cx } = useStyles();
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

  const sectionClasses = cx(classes.outer, parentClasses.outer, 'ui-ios__app-bar');

  return (
    <section
      className={sectionClasses}
      data-test-id="Navigator"
      style={style}
      aria-hidden={ariaHidden}
      ref={contentRef}
    >
      <SurroundPortals portalName={APP_BAR_CONTENT}>
        <div className={cx(classes.inner, parentClasses.inner)}>
          <Left elements={left} />
          <Center elements={center} />
          <Right elements={right} />
        </div>
      </SurroundPortals>
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
