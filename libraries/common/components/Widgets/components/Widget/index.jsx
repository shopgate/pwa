import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Loading from '../../../Loading';
import Grid from '../../../Grid';
import styles from './style';
/**
 * The widget component.
 */
class Widget extends Component {
  static propTypes = {
    config: PropTypes.shape().isRequired,
    component: PropTypes.func,
  };

  static defaultProps = {
    component: null,
  };

  /**
   * @param {Object} nextProps The next component props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    if (this.props.component !== nextProps.component) return true;
    if (!isEqual(this.props.config, nextProps.config)) return true;
    return false;
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      col,
      row,
      height,
      settings,
      width,
    } = this.props.config;

    if (!this.props.component) {
      return null;
    }

    return (
      <Grid.Item
        className={styles.widgetCell({
          col,
          row,
          height,
          width,
        })}
        component="div"
      >
        <div className={styles.content}>
          <Suspense fallback={<Loading />}>
            {React.createElement(this.props.component, {
              settings,
              ratio: [width, height],
            })}
          </Suspense>
        </div>
      </Grid.Item>
    );
  }
}

export default Widget;
