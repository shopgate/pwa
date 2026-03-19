import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import { useScrollContainer } from '@shopgate/engage/core/helpers';
import { RouteContext } from '@shopgate/pwa-common/context';
import { setPageBackgroundColor } from '../../styles';
import Content from './components/Content';
import ViewProvider from './provider';
import { ViewContext } from './context';

const { colors } = themeConfig;

const useStyles = makeStyles()((_, { inScrollContainer }) => ({
  root: inScrollContainer ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  } : {
    height: '100%',
  },
}));

// api: import { ViewContext } from '@shopgate/engage/components/View';
export { ViewContext };

/**
 * The View container component.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
function ViewContainer({
  background,
  children,
  noScrollOnKeyboard,
  visible,
  'aria-hidden': ariaHidden,
  noContentPortal,
  noKeyboardListener,
}) {
  const inScrollContainer = useScrollContainer();
  const { classes } = useStyles({ inScrollContainer });

  if (visible) {
    setPageBackgroundColor(background);
  }

  const style = {
    display: visible ? 'flex' : 'none',
  };

  return (
    <ViewProvider>
      <ViewContext.Consumer>
        {({ setContentRef, ariaHidden: ariaHiddenContext }) => (
          <section className={`${classes.root} engage__view`} style={style} aria-hidden={ariaHidden || ariaHiddenContext}>
            <Content
              noScrollOnKeyboard={noScrollOnKeyboard}
              noKeyboardListener={noKeyboardListener}
              setContentRef={setContentRef}
              noContentPortal={noContentPortal}
            >
              {children}
            </Content>
          </section>
        )}
      </ViewContext.Consumer>
    </ViewProvider>
  );
}

ViewContainer.propTypes = {
  visible: PropTypes.bool.isRequired,
  'aria-hidden': PropTypes.bool,
  background: PropTypes.string,
  children: PropTypes.node,
  noContentPortal: PropTypes.bool,
  noKeyboardListener: PropTypes.bool,
  noScrollOnKeyboard: PropTypes.bool,
};

ViewContainer.defaultProps = {
  'aria-hidden': false,
  background: colors.light,
  children: null,
  noScrollOnKeyboard: false,
  noContentPortal: false,
  noKeyboardListener: false,
};

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
export default function View(props) {
  return (
    <RouteContext.Consumer>
      {({ visible }) => (
        <ViewContainer {...props} visible={visible} />
      )}
    </RouteContext.Consumer>
  );
}
