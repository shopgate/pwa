import React, { Suspense, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { VisibilityOffIcon } from '@shopgate/engage/components';
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
    position: 'absolute',
    top: -marginTop,
    left: -marginLeft,
    fontSize: 24,
    padding: theme.spacing(1),
  },
  preview: {
    cursor: 'pointer',
  },
  visibilityIcon: {
    color: '#f44336',
    cursor: 'help',
  },
}));

/**
 * @typedef {import('./types').WidgetDefinition} WidgetDefinition
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

  const { setActiveId } = useWidgetsPreview();

  const handleInteraction = useCallback(() => {
    setActiveId(definition.code, true);
    dispatchWidgetPreviewEvent('widget-clicked', definition.code);
  }, [definition.code, setActiveId]);

  const handlers = usePressHandler(handleInteraction);

  if (!Component) {
    return null;
  }

  return (
    <section
      id={definition.code}
      className={cx(classes.root, {
        [classes.preview]: isPreview,
      })}
      style={{
        marginTop: definition?.layout?.marginTop,
        marginBottom: definition?.layout?.marginBottom,
        marginLeft: definition?.layout?.marginLeft,
        marginRight: definition?.layout?.marginRight,
      }}
      {... (isPreview && {
        ...handlers,
      })}
    >
      {isPreview && (
        <div className={classes.widgetInfo}>
          {definition?.visibility?.isHidden && (
            <Tooltip text={definition.meta.hiddenMessage}>
              <VisibilityOffIcon className={classes.visibilityIcon} />
            </Tooltip>
          )}
        </div>
      )}
      <WidgetProvider definition={definition}>
        <Suspense>
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
