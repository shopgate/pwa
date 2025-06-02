import React from 'react';
import PropTypes from 'prop-types';
import Widget from './Widget';

/**
 * @typedef {Object} WidgetListEntryVisibility
 * @property {boolean} isHidden Whether the widget is hidden.
 * @property {string} scheduleStartDate Start date for scheduled widgets.
 * @property {string} scheduleEndDate End date for scheduled widgets.
 */

/**
 * @typedef {Object} WidgetListEntryLayout
 * @property {number} marginTop Top margin for the widget.
 * @property {number} marginBottom Bottom margin for the widget.
 * @property {number} marginLeft Left margin for the widget.
 * @property {number} marginRight Right margin for the widget.
 */

/**
 * @typedef {Object} WidgetListEntry
 * @property {string} code Unique code for the widget.
 * @property {string} widgetConfigDefinitionCode Name of the widget.
 * @property {Object} widgetConfig Individual configuration for the widget.
 * @property {WidgetListEntryVisibility} visibility Visibility settings for the widget.
 * @property {WidgetListEntryLayout} layout Layout settings for the widget.
 */

/**
 * The WidgetList component renders a list of widgets.
 * @param {Object} props The component props.
 * @param {Array<WidgetListEntry>} props.widgets The list of widgets to render.
 * @returns {JSX.Element}
 */
const WidgetList = ({
  widgets = [],
}) => {
  if (!Array.isArray(widgets) || widgets.length === 0) {
    return null;
  }

  return (
    <div className="engage__widgets">
      {widgets.map(widget => <Widget key={widget.code} config={widget} isPreview />)}
    </div>
  );
};

WidgetList.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.shape()),
};

WidgetList.defaultProps = {
  widgets: null,
};

export default WidgetList;
