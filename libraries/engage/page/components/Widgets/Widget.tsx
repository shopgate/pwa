import {
  Suspense, useCallback, useMemo, type ComponentType,
} from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { VisibilityOffIcon, TimeIcon, Loading } from '@shopgate/engage/components';
import { usePressHandler } from '@shopgate/engage/core/hooks';
import { getWidgetMediaMargins } from '@shopgate/engage/settings/selectors/appSettings';
import WidgetProvider from './WidgetProvider';
import { dispatchWidgetPreviewEvent } from './events';
import { useWidgetsPreview } from './hooks';
import { getAppliedMediaMargins, resolveWidgetLayout } from './helpers';
import Tooltip from './Tooltip';
import { type WidgetDefinition, type WidgetLayout } from './types';

const useStyles = makeStyles<WidgetLayout>()((theme, {
  marginTop,
  marginLeft,
}) => ({
  root: {
    position: 'relative',
  },
  widgetInfo: {
    zIndex: 12,
    position: 'absolute',
    top: -marginTop + (theme.spacing(0.5) + 1),
    left: -marginLeft + theme.spacing(0.5),
    fontSize: theme.components.icon.medium,
    padding: theme.spacing(0.5),
    display: 'flex',
    gap: theme.spacing(1),
    background: theme.palette.background.surface,
    borderRadius: 4,
    border: '1px solid rgba(0, 0, 0, 0.23)',
    ':empty': {
      display: 'none',
    },
  },
  preview: {
    cursor: 'pointer',
  },
  visibilityIcon: {
    color: theme.palette.error.main,
  },
  scheduledIcon: {
    color: '#347DD3',
  },
  scheduledIconExpired: {
    color: theme.palette.error.main,
  },
}));

/**
 * Props of the {@link Widget} component.
 */
export interface WidgetProps {
  /**
   * The widget component to render.
   */
  component: ComponentType<{ settings?: WidgetDefinition['widgetConfig'] }>;
  /**
   * The widget definition data.
   */
  definition: WidgetDefinition;
  /**
   * Whether the widget is in preview mode.
   */
  isPreview: boolean;
  /**
   * Whether the widget is a legacy custom widget provided by an extension that's configured
   * via an HTML comment inside a HTML widget.
   */
  isCustomLegacyWidget?: boolean;
}

/**
 * The Widget component.
 */
const Widget = ({
  component: Component,
  definition,
  isPreview,
  isCustomLegacyWidget = false,
}: WidgetProps) => {
  const mediaMargins = useSelector(getWidgetMediaMargins);

  const layout = useMemo(() => resolveWidgetLayout(
    definition?.layout,
    getAppliedMediaMargins(definition?.widgetConfigDefinitionCode),
    mediaMargins
  ), [definition, mediaMargins]);

  const { classes, cx } = useStyles(layout);

  const { setActiveWidget, activeWidget } = useWidgetsPreview();

  // Handle clicks on the widget container in preview mode. Take care that highlighting only happens
  // when the widget is not already active, otherwise it would be confusing when users want to
  // interact with widget elements.
  const handleInteraction = useCallback(() => {
    setActiveWidget(definition.code, activeWidget !== definition.code);
    dispatchWidgetPreviewEvent('widget-clicked', definition.code);
  }, [activeWidget, definition.code, setActiveWidget]);

  const handlers = usePressHandler(handleInteraction);

  if (!Component) {
    return null;
  }

  return (
    <section
      id={`widget-code-${definition.code}`}
      className={cx(classes.root, {
        [classes.preview]: isPreview,
      })}
      style={{
        marginTop: layout.marginTop || undefined,
        marginBottom: layout.marginBottom || undefined,
        marginLeft: layout.marginLeft || undefined,
        marginRight: layout.marginRight || undefined,
      }}
      data-widget-name={definition.widgetConfigDefinitionCode}
      {... (isPreview && {
        ...handlers,
      })}
    >
      {isPreview && definition?.meta && (
        <div className={classes.widgetInfo}>
          {definition.meta?.scheduled?.isScheduled && (
            <Tooltip text={definition.meta?.scheduled?.tooltip}>
              <TimeIcon className={cx(classes.scheduledIcon, {
                [classes.scheduledIconExpired]: definition.meta?.scheduled?.isExpired,
              })}
              />
            </Tooltip>
          )}
          {(definition.meta?.hidden?.isHidden) && (
            <Tooltip text={definition.meta?.hidden?.tooltip}>
              <VisibilityOffIcon className={classes.visibilityIcon} />
            </Tooltip>
          )}
        </div>
      )}
      <WidgetProvider definition={definition} isPreview={isPreview} layout={layout}>
        <Suspense fallback={<Loading />}>
          <Component
            {...(isCustomLegacyWidget ? {
              settings: definition.widgetConfig,
            } : {})}
          />
        </Suspense>
      </WidgetProvider>
    </section>
  );
};

export default Widget;
