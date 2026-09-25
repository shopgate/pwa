import { useMemo, useRef, type ReactNode } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useRoute, useThemeWidgets } from '@shopgate/engage/core/hooks';
import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';
import { ConditionalWrapper } from '@shopgate/engage/components';
import { isDev } from '@shopgate/engage/core/helpers';
import WidgetsPreviewProvider from './WidgetsPreviewProvider';
import Widget from './Widget';
import Overlay from './Overlay';
import { checkScheduled } from './helpers';
import { usePreviewIframeCommunication } from './hooks';
import { type WidgetDefinition } from './types';

const PLACEHOLDER_COMPONENT = '@shopgate/widgetsInternal/Placeholder';

const useStyles = makeStyles()(({
  preview: {
    '& *': {
      scrollbarWidth: 'thin',
    },
  },
}));

/**
 * Props of the {@link Widgets} component.
 */
export interface WidgetsProps {
  /**
   * The list of widgets to render.
   */
  widgets?: WidgetDefinition[];
}

/**
 * The Widgets component renders a list of widgets.
 */
const Widgets = ({
  widgets: widgetsProp = [],
}: WidgetsProps) => {
  const { classes, cx } = useStyles();

  const { pattern } = useRoute() as { pattern: string };
  const widgetsRef = useRef<HTMLDivElement>(null);
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
    return widgetsProp.filter(
      widget =>
        !!widgetComponents[widget.widgetConfigDefinitionCode] &&
      checkScheduled({
        from: widget?.visibility.scheduleStartDate,
        to: widget?.visibility.scheduleEndDate,
      }).isActive
    );
  }, [isPreview, widgetComponents, widgetsProp]);

  if (!Array.isArray(widgets) || widgets.length === 0) {
    return null;
  }

  return (
    <ConditionalWrapper
      condition={isPreview}
      wrapper={(children: ReactNode) => (
        <WidgetsPreviewProvider>
          {children}
          <Overlay containerRef={widgetsRef} />
        </WidgetsPreviewProvider>
      )}
    >
      <div
        className={cx('engage__widgets', {
          [classes.preview]: isPreview,
        })}
        ref={widgetsRef}
      >
        {widgets.map((widget) => {
          const component = widgetComponents[widget.widgetConfigDefinitionCode] ||
          (isDev ? widgetComponents[PLACEHOLDER_COMPONENT] : null);

          return <Widget
            key={widget.code}
            definition={widget}
            isPreview={isPreview}
            component={component}
            isCustomLegacyWidget={widget.isCustomLegacyWidget}
          />;
        })}
      </div>
    </ConditionalWrapper>
  );
};

export default Widgets;
