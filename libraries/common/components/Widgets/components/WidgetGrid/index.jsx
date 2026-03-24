import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { makeStyles } from '@shopgate/engage/styles';
import Widget from '../Widget';
import shouldShowWidget from '../../helpers/shouldShowWidget';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridAutoRows: 'auto',
    gridAutoFlow: 'row dense',
    position: 'relative',
  },
}));

/**
 * The WidgetGrid component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const WidgetGrid = ({ components, config }) => {
  const { classes } = useStyles();

  const widgets = useMemo(() => (
    sortBy(config, ['row']).filter(w => shouldShowWidget(w.settings))
  ), [config]);

  if (!config.length) {
    return null;
  }

  return (
    <div className={`${classes.root} common__widgets__widget-grid`}>
      {Object.keys(widgets).map((key) => {
        const widget = widgets[key];
        const widgetKey = `w${key}`;
        const WidgetComponent = components[widget.type];
        return (
          <Widget
            config={widget}
            component={WidgetComponent}
            key={widgetKey}
          />
        );
      })}
    </div>
  );
};

WidgetGrid.propTypes = {
  components: PropTypes.shape().isRequired,
  config: PropTypes.arrayOf(PropTypes.shape()),
};

WidgetGrid.defaultProps = {
  config: [],
};

export default memo(WidgetGrid);
