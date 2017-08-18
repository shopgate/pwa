/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import extensions from 'Extensions';
import styles from './style';

const GRID_COLUMNS = 12; // One grid row has 12 columns.
const WIDGET_GRID_TYPE = 'core-widgets/widget-grid';

/**
 * Creates a grid wrapper for widget(s).
 * @param {string} key The unique key.
 * @param {Array} config Array of widgets to be placed in the grid.
 * @returns {JSX} The wrapper.
 */
const createGridWrapper = (key, config) => (
  React.createElement(
    extensions[WIDGET_GRID_TYPE],
    {
      key,
      config,
    }
  )
);

/**
 * Create array of elements from widget configuration.
 * @param {Array} widgets Array of widget configurations.
 * @returns {Array} Array of JSX elements.
 */
const createArrayOfElements = widgets => (
  (widgets || []).map((widget, index) => {
    if (!extensions[widget.type]) {
      return null;
    }

    const key = `w${index}`;

    if (widget.type === WIDGET_GRID_TYPE) {
      // If it's a grid just create it and pass the child widgets.
      return createGridWrapper(key, widget.settings.widgets);
    } else if (widget.height) {
      // If it has a definite height wrap the widget in a grid.
      return createGridWrapper(
        key,
        [{
          ...widget,
          col: 0,
          row: 0,
          width: GRID_COLUMNS,
        }]
      );
    }

    // In all other cases just create and return the widget component.
    return React.createElement(
      extensions[widget.type],
      {
        ...widget,
        key,
      }
    );
  })
);

/**
 * The widgets component.
 * @param {Object} props The component properties.
 * @returns {JSX} The Widgets.
 */
const Widgets = props => (
  <div className={styles}>
    {createArrayOfElements(props.widgets)}
  </div>
);

Widgets.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.shape()),
};

Widgets.defaultProps = {
  widgets: null,
};

export default Widgets;
