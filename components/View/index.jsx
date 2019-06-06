import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { RouteContext } from '@shopgate/pwa-common/context';
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
  'aria-hidden': ariaHidden,
}) {
  if (visible) {
    setBackgroundColor(background);
  }

  const style = {
    display: visible ? 'block' : 'none',
  };

  return (
    <section className={styles} style={style} aria-hidden={ariaHidden}>
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
  'aria-hidden': PropTypes.bool,
  background: PropTypes.string,
  children: PropTypes.node,
  hasNavigator: PropTypes.bool,
  noScrollOnKeyboard: PropTypes.bool,
};

ViewContainer.defaultProps = {
  'aria-hidden': true,
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
