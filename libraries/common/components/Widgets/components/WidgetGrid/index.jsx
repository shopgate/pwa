import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import Widget from '../Widget';
import styles from './style';
import shouldShowWidget from '../../helpers/shouldShowWidget';

/**
 * The WidgetGrid component.
 */
class WidgetGrid extends Component {
  static propTypes = {
    components: PropTypes.shape().isRequired,
    config: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    config: [],
  };

  /**
   * @param {Object} nextProps The next component props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.components, nextProps.components)) return true;
    if (!isEqual(this.props.config, nextProps.config)) return true;
    return false;
  }

  /**
   * Render the component.
   * @return {JSX}
   */
  render() {
    const { components, config } = this.props;

    if (!config.length) {
      return null;
    }

    // TODO: This should not happen within every render call.
    // Sort the widgets by row. This has to happen to take care of the z-index flow.
    const widgets = sortBy(config, ['row']).filter(w => shouldShowWidget(w.settings));

    return (
      <div className={styles}>
        {Object.keys(widgets).map((key) => {
          const widget = widgets[key];
          const widgetKey = `w${key}`;
          // Map to the correct widget component using the `type` key inside the widget.
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
  }
}

export default WidgetGrid;
