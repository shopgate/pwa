import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRoute, useThemeWidgets } from '@shopgate/engage/core/hooks';
import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';
import { ConditionalWrapper } from '@shopgate/engage/components';
import WidgetsPreviewProvider from './WidgetsPreviewProvider';
import Widget from './Widget';
import Overlay from './Overlay';
import { usePreviewIframeCommunication } from './hooks';

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

const PLACEHOLDER_COMPONENT = '@shopgate/widgetsInternal/Placeholder';

/**
 * The Widgets component renders a list of widgets.
 * @param {Object} props The component props.
 * @param {Array<WidgetDefinition>} props.widgets The list of widgets to render.
 * @returns {JSX.Element}
 */
const Widgets = ({
  widgets: widgetsProp = [],
}) => {
  const { pattern } = useRoute();
  const widgetsRef = useRef(null);
  const isPreview = pattern === PAGE_PREVIEW_PATTERN;
  const widgetComponents = useThemeWidgets('v2');

  usePreviewIframeCommunication(isPreview);

  // Create sanitized widgets array that only includes widgets with valid components.
  const widgets = useMemo(() => {
    if (isPreview) {
      // All widgets are allowed in preview mode.
      return widgetsProp;
    }

    // Remove widgets that do not have a valid component.
    return widgetsProp.filter(widget => !!widgetComponents[widget.widgetConfigDefinitionCode]);
  }, [isPreview, widgetComponents, widgetsProp]);

  if (!Array.isArray(widgets) || widgets.length === 0) {
    return null;
  }
  return (
    <ConditionalWrapper
      condition={isPreview}
      wrapper={children => (
        <WidgetsPreviewProvider>
          {children}
          <Overlay containerRef={widgetsRef} />
        </WidgetsPreviewProvider>
      )}
    >
      <div className="engage__widgets" ref={widgetsRef}>
        {widgets.map((widget) => {
          const component = widgetComponents[widget.widgetConfigDefinitionCode] ||
          widgetComponents[PLACEHOLDER_COMPONENT];

          return <Widget
            key={widget.code}
            definition={widget}
            isPreview={isPreview}
            component={component}
          />;
        })}
      </div>
    </ConditionalWrapper>
  );
};

Widgets.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.shape()),
};

Widgets.defaultProps = {
  widgets: null,
};

export default Widgets;
