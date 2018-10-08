import React from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@virtuous/react-conductor/Router';
import { ViewContext } from 'Components/View/context';
import colors from 'Styles/colors';
import ViewProvider from '../../providers/View';
import Content from './components/Content';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const View = ({
  background,
  children,
  hasNavigator,
  isFullscreen,
  pathname,
}) => (
  <ViewProvider>
    <section
      className={styles}
      data-test-id={`view: ${pathname || '-'}`}
      style={{ background }}
    >
      <ViewContext.Consumer>
        {({ set }) => (
          <Content
            hasNavigator={hasNavigator}
            isFullscreen={isFullscreen}
            setRef={set}
          >
            {children}
          </Content>
        )}
      </ViewContext.Consumer>
    </section>
  </ViewProvider>
);

View.propTypes = {
  background: PropTypes.string,
  children: PropTypes.node,
  hasNavigator: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  pathname: PropTypes.string,
};

View.defaultProps = {
  background: colors.light,
  children: null,
  hasNavigator: true,
  isFullscreen: false,
  pathname: null,
};

export default props => (
  <RouteContext.Consumer>
    {({ pathname }) => (
      <View {...props} pathname={pathname} />
    )}
  </RouteContext.Consumer>
);
