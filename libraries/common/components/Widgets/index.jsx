import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import WidgetGrid from './components/WidgetGrid';

const WIDGET_GRID_TYPE = '@shopgate/commerce-widgets/widget-grid';
const GRID_COLUMNS = 12; // One grid row has 12 columns.

/**
 * Creates a grid wrapper for widget(s).
 * @param {string} key The unique key.
 * @param {Array} config Array of widgets to be placed in the grid.
 * @param {Array} components The component definitions for the widgets.
 * @returns {JSX} The wrapper.
 */
const createGridWrapper = (key, config, components) => (
  React.createElement(
    WidgetGrid,
    {
      key,
      config,
      components,
    }
  )
);

/**
 * The widgets component.
 */
class Widgets extends Component {
  static propTypes = {
    components: PropTypes.shape(),
    widgets: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    components: null,
    widgets: null,
  };

  /**
   * @param {Object} nextProps The next component props.
   * @return {JSX}
   */
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.components, nextProps.components)) return true;
    if (!isEqual(this.props.widgets, nextProps.widgets)) return true;
    return false;
  }

  /**
   * Create array of elements from widget configuration.
   * @returns {Array} Array of JSX elements.
   */
  createArrayOfElements() {
    const { widgets = [], components } = this.props;

    return widgets.map((widget, index) => {
      if (!components[widget.type] && widget.type !== WIDGET_GRID_TYPE) {
        return null;
      }

      const key = `w${index}`;

      if (widget.type === WIDGET_GRID_TYPE) {
        // If it's a grid just create it and pass the child widgets.
        return createGridWrapper(key, widget.settings.widgets, components);
      } else if (widget.height) {
        // If it has a definite height wrap the widget in a grid.
        return createGridWrapper(
          key,
          [{
            ...widget,
            col: 0,
            row: 0,
            width: GRID_COLUMNS,
          }],
          components
        );
      }

      // In all other cases just create and return the widget component.
      return React.createElement(
        components[widget.type],
        {
          ...widget,
          key,
        }
      );
    });
  }

  /**
   * @return {JSX}
   */
  render() {
    const { widgets, components } = this.props;

    if (!widgets) {
      return null;
    }

    return (
      <div>{this.createArrayOfElements(widgets, components)}</div>
    );
  }
}

export default Widgets;
