import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, keyframes, colorToRgba } from '@shopgate/engage/styles';
import { VisibilityOffIcon } from '@shopgate/engage/components';
import { usePressHandler, useRoute } from '@shopgate/engage/core/hooks';
import { useWidgetPreviewEvent, dispatchWidgetPreviewEvent } from './events';

const useStyles = makeStyles()((theme, { highlightColor }) => ({
  root: {
    minHeight: 200,
    '&:first-child': {
      borderTop: '1px solid #ccc',
    },
    borderBottom: '1px solid #ccc',
    position: 'relative',
    padding: theme.spacing(1),
    overflowY: 'auto',
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
  pre: {
    fontSize: 10,
  },
  preview: {
    cursor: 'pointer',
  },
  previewFlash: {
    animationName: keyframes({
      '0%': { backgroundColor: 'transparent' },
      '50%': { backgroundColor: colorToRgba(highlightColor || '#50A9AD', 0.5) },
      '100%': { backgroundColor: 'transparent' },
    }),
    animationDuration: '0.5s',
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'forwards',
  },
}));

/**
 * @typedef {import('./Widgets.jsx').WidgetDefinition} WidgetDefinition
 */

/**
 * The Widget component.
 * @param {Object} props The component props.
 * @param {WidgetDefinition} props.definition The widget definition data.
 * @param {boolean} props.isPreview Whether the widget is in preview mode.
 * @returns {JSX.Element}
 */
const Widget = ({
  definition,
  isPreview,
}) => {
  const { query: { highlightColor } } = useRoute();
  const { classes, css, cx } = useStyles({ highlightColor });

  const [isFlashing, setIsFlashing] = useState(false);

  useWidgetPreviewEvent('highlight-widget', (e) => {
    if (e.detail.widgetCode === definition.code) {
      setIsFlashing(true);
    }
  });

  const handleInteraction = useCallback(() => {
    setIsFlashing(true);
    dispatchWidgetPreviewEvent('widget-clicked', definition.code);
  }, [definition.code]);

  const handlers = usePressHandler(handleInteraction);

  return (
    <div
      id={definition.code}
      className={cx(classes.root, css({
        marginTop: definition?.layout?.marginTop,
        marginBottom: definition?.layout?.marginBottom,
        marginLeft: definition?.layout?.marginLeft,
        marginRight: definition?.layout?.marginRight,
      }), {
        [classes.previewFlash]: isFlashing,
        [classes.preview]: isPreview,
      })}
      {... (isPreview && {
        onAnimationEnd: () => setIsFlashing(false),
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
      <pre className={classes.pre}>
        {JSON.stringify(definition, null, 2)}
      </pre>
    </div>
  );
};

Widget.propTypes = {
  definition: PropTypes.shape().isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default Widget;
