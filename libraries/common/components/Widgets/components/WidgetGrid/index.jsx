import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import Widget from '../Widget';
import styles from './style';

/**
 * The widget grid widget component.
 * @param {Object} props The component properties.
 * @returns {JSX} The widget grid.
 */
const WidgetGrid = (props) => {
  // No widgets, nothing to do.
  if (!props.config.length) {
    return null;
  }
  // Sort the widgets by row. This has to happen to take care of the z-index flow.
  const widgets = sortBy(props.config, ['row']);

  // The height of the widget area.
  return (
    <div className={styles} >
      {Object.keys(widgets).map((key) => {
        const widget = widgets[key];
        const widgetKey = `w${key}`;

        // Map to the correct widget component using the `type` key inside the widget.
        const WidgetComponent = props.components[widget.type];

        return (
          <Widget
            config={widget}
            component={WidgetComponent}
            key={widgetKey}
          />
        );
      })}
    </div>
  );
};

WidgetGrid.propTypes = {
  components: PropTypes.shape().isRequired,
  config: PropTypes.arrayOf(PropTypes.shape()),
};

WidgetGrid.defaultProps = {
  config: [],
};

export default WidgetGrid;
