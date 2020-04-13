import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { RouteContext } from '@shopgate/pwa-common/context';
import { setPageBackgroundColor } from '../../styles';
import Content from './components/Content';
import ViewProvider from './provider';
import { ViewContext } from './context';
import styles from './style';

const { colors } = themeConfig;

// api: import { ViewContext } from '@shopgate/engage/components/View';
export { ViewContext };

/**
 * The View container component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function ViewContainer({
  background,
  children,
  noScrollOnKeyboard,
  visible,
  'aria-hidden': ariaHidden,
}) {
  if (visible) {
    setPageBackgroundColor(background);
  }

  const style = {
    display: visible ? 'block' : 'none',
  };

  return (
    <ViewProvider>
      <ViewContext.Consumer>
        {({ setContentRef, ariaHidden: ariaHiddenContext }) => (
          <section className={styles} style={style} aria-hidden={ariaHidden || ariaHiddenContext}>
            <Content
              noScrollOnKeyboard={noScrollOnKeyboard}
              setContentRef={setContentRef}
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
  noScrollOnKeyboard: PropTypes.bool,
};

ViewContainer.defaultProps = {
  'aria-hidden': true,
  background: colors.light,
  children: null,
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
