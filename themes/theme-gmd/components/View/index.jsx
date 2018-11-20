import React from 'react';
import PropTypes from 'prop-types';
import colors from 'Styles/colors';
import Content from './components/Content';
import ViewProvider from '../../providers/View';
import styles from './style';

/**
 * The View component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const View = ({
  background,
  children,
  hasNavigator,
  noScrollOnKeyboard,
}) => (
  <section className={styles} style={{ background }}>
    <ViewProvider>
      <Content
        hasNavigator={hasNavigator}
        noScrollOnKeyboard={noScrollOnKeyboard}
      >
        {children}
      </Content>
    </ViewProvider>
  </section>
);

View.propTypes = {
  background: PropTypes.string,
  children: PropTypes.node,
  hasNavigator: PropTypes.bool,
  noScrollOnKeyboard: PropTypes.bool,
};

View.defaultProps = {
  background: colors.light,
  children: null,
  hasNavigator: true,
  noScrollOnKeyboard: false,
};

export default View;
