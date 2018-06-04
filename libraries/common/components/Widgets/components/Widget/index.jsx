import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Grid from '../../../Grid';
import styles from './style';

/**
 * The widget component.
 */
class Widget extends Component {
  static propTypes = {
    config: PropTypes.shape().isRequired,
    cellSize: PropTypes.number,
    component: PropTypes.func,
  };

  static defaultProps = {
    cellSize: null,
    component: null,
  };

  /**
   * @param {Object} nextProps The next component props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    if (this.props.cellSize !== nextProps.cellSize) return true;
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
    const { cellSize } = this.props;

    if (!this.props.component) {
      return null;
    }

    let className = '';
    if (cellSize) {
      className = [
        styles.height(cellSize, height, width),
        styles.width(width),
        styles.top(cellSize, row, height),
        styles.left(col),
      ].join(' ');
    }

    return (
      <Grid.Item
        className={className}
        component="div"
      >
        <div className={styles.content}>
          {React.createElement(this.props.component, {
            settings,
            ratio: [width, height],
          })}
        </div>
      </Grid.Item>
    );
  }
}

export default Widget;
