import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WidgetGrid from './components/WidgetGrid';
import shouldShowWidget from './helpers/shouldShowWidget';

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
 * Create array of elements from widget configuration.
 * @param {Array} widgets Array of widget configurations.
 * @param {Array} components The component definitions for the widgets.
 * @returns {Array} Array of JSX elements.
 */
const createArrayOfElements = (widgets, components) => (
  (widgets || []).map((widget, index) => {
    if (!shouldShowWidget(widget.settings)) {
      return null;
    }
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
  })
);
/**
 * The Widgets component.
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
   * Checks if any widget is schedulable.
   * @param {Array} widgets Array of widgets.
   * @returns {boolean}
   */
  static hasSchedulableWidgets(widgets) {
    return (widgets || []).some(w => w.settings.plan);
  }

  /**
   * Constructs.
   * @param {Object} props Props.
   */
  constructor(props) {
    super(props);
    this.autoReloadInterval = undefined;
    if (this.constructor.hasSchedulableWidgets(this.props.widgets)) {
      this.startAutoRerender();
    }
  }

  /**
   * Component will unmount lifecycle method.
   */
  componentWillUnmount() {
    this.stopAutoRerender();
  }

  /**
   * Sets auto re-render.
   */
  startAutoRerender() {
    const minutesToRoundedHour = 60 - new Date().getMinutes();
    const nextRerenderIn = minutesToRoundedHour * 60000;
    this.autoReloadTimeout = setTimeout(() => this.doAutoRerender(), nextRerenderIn);
  }

  /**
   * Stops auto re-render. Must be called before component is unmounted to avoid
   * memory leak.
   */
  stopAutoRerender() {
    clearTimeout(this.autoReloadTimeout);
  }

  /**
   * Forces re-render and sets another timeout for next cycle.
   */
  doAutoRerender() {
    this.forceUpdate();
    this.startAutoRerender();
  }

  /**
   * Renders widgets.
   * @returns {JSX}
   */
  render() {
    if (!this.props.widgets) {
      return null;
    }

    return (
      <div>{createArrayOfElements(this.props.widgets, this.props.components)}</div>
    );
  }
}

export default Widgets;
