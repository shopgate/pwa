import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { VisibilityOffIcon } from '@shopgate/engage/components';

const useStyles = makeStyles()(theme => ({
  root: {
    minHeight: 80,
    border: '1px solid #ccc',
    position: 'relative',
    padding: theme.spacing(1),
    [theme.breakpoints.down('xl')]: {

    },
  },
  widgetInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: 24,
  },
  visibilityIcon: {
    color: 'red',
  },
}));

/**
 * @typedef {import('./WidgetList.jsx').WidgetListEntry} WidgetListEntry
 */

/**
 * The Widget component.
 * @param {Object} props The component props.
 * @param {WidgetListEntry} props.config The widget data.
 * @param {boolean} props.isPreview Whether the widget is in preview mode.
 * @returns {JSX.Element}
 */
const Widget = ({
  config,
  isPreview,
}) => {
  const { classes, css, cx } = useStyles();

  return (
    <div
      className={cx(classes.root, css({
        marginTop: config?.layout?.marginTop,
        marginBottom: config?.layout?.marginBottom,
        marginLeft: config?.layout?.marginLeft,
        marginRight: config?.layout?.marginRight,
      }))}
      id={config.code}
    >
      {isPreview && (
        <div className={classes.widgetInfo}>
          {config?.visibility?.isHidden && (
            <VisibilityOffIcon className={classes.visibilityIcon} />
          )}
        </div>
      )}
    </div>
  );
};

Widget.propTypes = {
  config: PropTypes.shape().isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default Widget;
