import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import shouldUpdate from 'recompose/shouldUpdate';
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
  style,
}) => (
  <section className={styles} style={style}>
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
  style: null,
};

export default shouldUpdate((prev, next) => {
  if (!isEqual(prev.children, next.children)) return true;
  if (!isEqual(prev.style, next.style)) return true;
  return false;
})(View);
