import React from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@virtuous/react-conductor/Router';
import colors from 'Styles/colors';
import ViewContent from './components/Content';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const View = ({
  background,
  children,
  hasNavigator,
  head,
  isFullscreen,
  pathname,
}) => (
  <section
    className={styles}
    data-test-id={`view: ${pathname || '-'}`}
    style={{ background }}
  >
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
  background: PropTypes.string,
  children: PropTypes.node,
  hasNavigator: PropTypes.bool,
  head: PropTypes.shape(),
  isFullscreen: PropTypes.bool,
  pathname: PropTypes.string,
};

View.defaultProps = {
  background: colors.light,
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
};

export default props => (
  <RouteContext.Consumer>
    {({ pathname }) => (
      <View {...props} pathname={pathname} />
    )}
  </RouteContext.Consumer>
);
