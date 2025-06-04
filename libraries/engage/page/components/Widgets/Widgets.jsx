import React from 'react';
import PropTypes from 'prop-types';
import { useRoute } from '@shopgate/engage/core/hooks';
import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';
import { usePreviewIframeCommunication } from './hooks';
import Widget from './Widget';

/**
 * @typedef {Object} WidgetDefinitionVisibility
 * @property {boolean} isHidden Whether the widget is hidden.
 * @property {string} scheduleStartDate Start date for scheduled widgets.
 * @property {string} scheduleEndDate End date for scheduled widgets.
 */

/**
 * @typedef {Object} WidgetDefinitionLayout
 * @property {number} marginTop Top margin for the widget.
 * @property {number} marginBottom Bottom margin for the widget.
 * @property {number} marginLeft Left margin for the widget.
 * @property {number} marginRight Right margin for the widget.
 */

/**
 * @typedef {Object} WidgetDefinition
 * @property {string} code Unique code for the widget.
 * @property {string} widgetConfigDefinitionCode Name of the widget.
 * @property {Object} widgetConfig Individual configuration for the widget.
 * @property {WidgetDefinitionVisibility} visibility Visibility settings for the widget.
 * @property {WidgetDefinitionLayout} layout Layout settings for the widget.
 */

/**
 * The Widgets component renders a list of widgets.
 * @param {Object} props The component props.
 * @param {Array<WidgetDefinition>} props.widgets The list of widgets to render.
 * @returns {JSX.Element}
 */
const Widgets = ({
  widgets = [],
}) => {
  const { pattern } = useRoute();
  const isPreview = pattern === PAGE_PREVIEW_PATTERN;

  usePreviewIframeCommunication(isPreview);

  if (!Array.isArray(widgets) || widgets.length === 0) {
    return null;
  }

  return (
    <div className="engage__widgets">
      {widgets.map(widget => <Widget
        key={widget.code}
        definition={widget}
        isPreview={isPreview}
      />)}
    </div>
  );
};

Widgets.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.shape()),
};

Widgets.defaultProps = {
  widgets: null,
};

export default Widgets;
