import React from 'react';
import PropTypes from 'prop-types';
import Grid from '../../../Grid';
import styles from './style';

/**
 * The widget component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Widget = (props) => {
  const {
    col,
    row,
    height,
    settings,
    width,
  } = props.config;
  const { cellSize } = props;

  if (!props.component) {
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
        {React.createElement(props.component, {
          settings,
          ratio: [width, height],
        })}
      </div>
    </Grid.Item>
  );
};

Widget.propTypes = {
  config: PropTypes.shape().isRequired,
  cellSize: PropTypes.number,
  component: PropTypes.func,
};

Widget.defaultProps = {
  cellSize: null,
  component: null,
};

export default Widget;
