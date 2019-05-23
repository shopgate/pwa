import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { RouteContext } from '@shopgate/engage/core';
import Content from './components/Content';
import ViewProvider from '../../providers/View';
import { ViewContext } from './context';
import styles, { setBackgroundColor } from './style';

const { colors } = themeConfig;

/**
 * The View container component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function ViewContainer({
  background,
  children,
  hasNavigator,
  noScrollOnKeyboard,
  visible,
}) {
  if (visible) {
    setBackgroundColor(background);
  }

  const style = {
    display: visible ? 'block' : 'none',
  };

  return (
    <section className={styles} style={style}>
      <ViewProvider>
        <ViewContext.Consumer>
          {({ setContentRef }) => (
            <Content
              hasNavigator={hasNavigator}
              noScrollOnKeyboard={noScrollOnKeyboard}
              setContentRef={setContentRef}
            >
              {children}
            </Content>
          )}
        </ViewContext.Consumer>
      </ViewProvider>
    </section>
  );
}

ViewContainer.propTypes = {
  visible: PropTypes.bool.isRequired,
  background: PropTypes.string,
  children: PropTypes.node,
  hasNavigator: PropTypes.bool,
  noScrollOnKeyboard: PropTypes.bool,
};

ViewContainer.defaultProps = {
  background: colors.light,
  children: null,
  hasNavigator: true,
  noScrollOnKeyboard: false,
};

/**
 * @param {Object} props The component props.
 * @returns {JSX}
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
