import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import Widget from '../Widget';
import styles from './style';

// One grid row has 12 columns.
const GRID_COLUMNS = 12;

/**
 * Iterate through all widgets and return the maximum
 * height based on row and height information.
 * @param {Array} widgets Array of widgets.
 * @returns {number} Height of the widget grid.
 */
const getMaxHeight = widgets => (
  widgets.reduce(
    (max, widget) => Math.max(widget.row + widget.height, max),
    0
  )
);

/**
 * The widget grid widget component.
 */
class WidgetGrid extends Component {
  static propTypes = {
    components: PropTypes.shape().isRequired,
    config: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    config: [],
  };

  /**
   * @param {Object} nextProps The next component props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.components, nextProps.components)) return true;
    if (!isEqual(this.props.config, nextProps.config)) return true;
    return false;
  }

  /**
   * Render the component.
   * @return {JSX}
   */
  render() {
    const rowCount = getMaxHeight(this.props.config);

    // The cell size is 1/12 of the viewport width.
    const cellSize = Math.floor(window.innerWidth / GRID_COLUMNS);

    if (!this.props.config || !rowCount) {
      return null;
    }

    // Sort the widgets by row. This has to happen to take care of the z-index flow.
    const widgets = sortBy(this.props.config, ['row']);

    // The height of the widget area.
    const height = `${rowCount * cellSize}px`;

    return (
      <div className={styles} style={{ height }}>
        {Object.keys(widgets).map((key) => {
          const widget = widgets[key];
          const widgetKey = `w${key}`;

          // Map to the correct widget component using the `type` key inside the widget.
          const WidgetComponent = this.props.components[widget.type];

          return (
            <Widget
              cellSize={cellSize}
              config={widget}
              component={WidgetComponent}
              key={widgetKey}
            />
          );
        })}
      </div>
    );
  }
}

export default WidgetGrid;
