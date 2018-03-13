/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
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
 * Create array of elements from widget configuration.
 * @param {Array} widgets Array of widget configurations.
 * @param {Array} components The component definitions for the widgets.
 * @returns {Array} Array of JSX elements.
 */
const createArrayOfElements = (widgets, components) => (
  (widgets || []).map((widget, index) => {
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
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Widgets = ({ widgets, components }) => {
  if (!widgets) {
    return null;
  }

  return (
    <div>{createArrayOfElements(widgets, components)}</div>
  );
};

Widgets.propTypes = {
  components: PropTypes.shape(),
  widgets: PropTypes.arrayOf(PropTypes.shape()),
};

Widgets.defaultProps = {
  components: null,
  widgets: null,
};

export default Widgets;
