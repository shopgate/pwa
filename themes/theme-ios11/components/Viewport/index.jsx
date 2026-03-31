import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { makeStyles, setViewportHeight } from '@shopgate/engage/styles';
import { insertGlobalRule } from '@shopgate/engage/styles/utils/globalStyles';
import { Footer } from '@shopgate/engage/components';
import { LiveMessenger } from '@shopgate/engage/a11y';
import { useScrollContainer, hasWebBridge } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import TabBar from 'Components/TabBar';

const { colors } = themeConfig;
const defaultBackgroundColor = colors.light;

insertGlobalRule('html', {
  '--page-background-color': defaultBackgroundColor,
  '--tabbar-height': '0px',
  '--app-bar-height': '0px',
});

const useStyles = makeStyles()({
  viewport: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    overflow: useScrollContainer() ? 'hidden' : 'inherit',
    position: 'relative',
    width: '100vw',
  },
  content: {
    flexGrow: 1,
    position: 'relative',
    zIndex: 0,
    ...(hasWebBridge() ? {
      display: 'flex',
      justifyContent: 'center',
    } : {}),
  },
  header: {
    top: 0,
    flexShrink: 1,
    position: hasWebBridge() ? 'sticky' : 'relative',
    zIndex: 1,
  },
});

window.onresize = debounce(() => {
  setViewportHeight();
}, 200);

setViewportHeight();

/**
 * The Viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = (props) => {
  const { classes, cx } = useStyles();

  return (
    <main className={cx(classes.viewport, 'theme__viewport')} role="main" itemScope itemProp="http://schema.org/MobileApplication">
      <LiveMessenger />
      <header className={classes.header} id="AppHeader" />
      <section className={classes.content} id="AppContent">
        {props.children}
      </section>
      <Footer>
        <TabBar />
      </Footer>
    </main>
  );
};

Viewport.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Viewport;
