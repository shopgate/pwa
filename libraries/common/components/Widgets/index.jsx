import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import WidgetGrid from './components/WidgetGrid';
import shouldShowWidget from './helpers/shouldShowWidget';

const WIDGET_GRID_TYPE = '@shopgate/commerce-widgets/widget-grid';
const GRID_COLUMNS = 12; // One grid row has 12 columns. // TODO: is it deprecated since css grid?

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
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);
    this.autoReloadInterval = undefined;
    if (this.hasSchedulableWidgets()) {
      this.startAutoRerender();
    }
  }

  /**
   * @param {Object} nextProps The next component props.
   * @return {JSX}
   */
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.components, nextProps.components)) {
      return true;
    }

    if (!isEqual(this.props.widgets, nextProps.widgets)) {
      return true;
    }

    return false;
  }

  /**
   * Component will unmount lifecycle method.
   */
  componentWillUnmount() {
    this.stopAutoRerender();
  }

  /**
   * Checks if any widget is schedulable.
   * @param {Array} widgets Array of widgets.
   * @returns {boolean}
   */
  hasSchedulableWidgets() {
    return (this.props.widgets || []).some(widget => widget.settings.plan);
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
   * Create array of elements from widget configuration.
   * @returns {Array} Array of JSX elements.
   */
  createArrayOfElements() {
    const { widgets = [], components } = this.props;

    return widgets
      .filter(widget => shouldShowWidget(widget.settings))
      .map((widget, index) => {
        if (!components[widget.type] && widget.type !== WIDGET_GRID_TYPE) {
          return null;
        }

        const key = `w${index}`;

        if (widget.type === WIDGET_GRID_TYPE) {
          // If it's a grid just create it and pass the child widgets.
          return createGridWrapper(key, widget.settings.widgets, components);
        }

        if (widget.height) {
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
