import React from 'react';
import PropTypes from 'prop-types';
import colors from 'Styles/colors';
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
}) => (
  <section className={styles} style={{ background }}>
    <Content hasNavigator={hasNavigator} isFullscreen={isFullscreen}>
      {children}
    </Content>
  </section>
);

View.propTypes = {
  background: PropTypes.string,
  children: PropTypes.node,
  hasNavigator: PropTypes.bool,
  isFullscreen: PropTypes.bool,
};

View.defaultProps = {
  background: colors.light,
  children: null,
  hasNavigator: true,
  isFullscreen: false,
};

export default View;
