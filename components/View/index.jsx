import React from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@virtuous/react-conductor/Router';
import ViewContent from './components/Content';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const View = ({
  children,
  hasNavigator,
  head,
  isFullscreen,
  pathname,
  style,
}) => (
  <section className={styles} style={style} data-test-id={`view: ${pathname || '-'}`}>
    <ViewContent
      hasNavigator={hasNavigator}
      head={head}
      isFullscreen={isFullscreen}
    >
      {children}
    </ViewContent>
  </section>
);

View.propTypes = {
  children: PropTypes.node,
  hasNavigator: PropTypes.bool,
  head: PropTypes.shape(),
  isFullscreen: PropTypes.bool,
  pathname: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
};

View.defaultProps = {
  children: null,
  hasNavigator: true,
  head: {
    meta: [],
    link: [],
    script: [],
    style: [],
  },
  isFullscreen: false,
  pathname: null,
  style: null,
};

export default props => (
  <RouteContext.Consumer>
    {({ pathname }) => (
      <View {...props} pathname={pathname} />
    )}
  </RouteContext.Consumer>
);
