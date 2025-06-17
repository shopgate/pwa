import React, { Suspense, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { VisibilityOffIcon, TimeIcon, Loading } from '@shopgate/engage/components';
import { usePressHandler } from '@shopgate/engage/core/hooks';
import WidgetProvider from './WidgetProvider';
import { dispatchWidgetPreviewEvent } from './events';
import { useWidgetsPreview } from './hooks';
import Tooltip from './Tooltip';

const useStyles = makeStyles()((theme, {
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
    fontSize: 24,
    padding: theme.spacing(0.5),
    display: 'flex',
    gap: theme.spacing(1),
    background: '#fff',
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
    color: '#f44336',
  },
  scheduledIcon: {
    color: '#347DD3',
  },
  scheduledIconExpired: {
    color: '#f44336',
  },
}));

/**
 * @typedef {import('./types').WidgetDefinition} WidgetDefinition
 */

/**
 * @typedef {import('./types').ScheduledStatus} ScheduledStatus
 */

/**
 * The Widget component.
 * @param {Object} props The component props.
 * @param {React.ComponentType} props.component The widget component to render.
 * @param {WidgetDefinition} props.definition The widget definition data.
 * @param {boolean} props.isPreview Whether the widget is in preview mode.
 * @returns {JSX.Element}
 */
const Widget = ({
  component: Component,
  definition,
  isPreview,
}) => {
  const { classes, cx } = useStyles({
    marginTop: definition?.layout?.marginTop ?? 0,
    marginBottom: definition?.layout?.marginBottom ?? 0,
    marginLeft: definition?.layout?.marginLeft ?? 0,
    marginRight: definition?.layout?.marginRight ?? 0,
  });

  const { setActiveWidget, activeWidget } = useWidgetsPreview();

  const handleInteraction = useCallback(() => {
    setActiveWidget(definition.code, activeWidget === definition.code);
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
        marginTop: definition?.layout?.marginTop,
        marginBottom: definition?.layout?.marginBottom,
        marginLeft: definition?.layout?.marginLeft,
        marginRight: definition?.layout?.marginRight,
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
      <WidgetProvider definition={definition}>
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      </WidgetProvider>
    </section>
  );
};

Widget.propTypes = {
  component: PropTypes.elementType.isRequired,
  definition: PropTypes.shape().isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default Widget;
