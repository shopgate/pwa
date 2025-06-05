import React, { Suspense, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { VisibilityOffIcon } from '@shopgate/engage/components';
import { usePressHandler } from '@shopgate/engage/core/hooks';
import WidgetProvider from './WidgetProvider';
import { dispatchWidgetPreviewEvent } from './events';
import { useWidgetsPreview } from './hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'relative',
    overflowY: 'hidden',
  },
  widgetInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: 24,
    padding: theme.spacing(1),
  },
  visibilityIcon: {
    color: 'red',
  },
}));

/**
 * @typedef {import('./Widgets.jsx').WidgetDefinition} WidgetDefinition
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
  const { classes, cx } = useStyles();

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
      className={cx(classes.root)}
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
            <VisibilityOffIcon className={classes.visibilityIcon} />
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
