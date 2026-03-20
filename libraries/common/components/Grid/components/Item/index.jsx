import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@shopgate/engage/styles';
import { objectWithoutProps } from '../../../../helpers/data';

/**
 * The grid item component.
 */
class GridItem extends Component {
  static propTypes = {
    className: PropTypes.string,
    component: PropTypes.string,
    grow: PropTypes.number,
    shrink: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    component: 'li',
    grow: 0,
    shrink: 1,
  };

  /**
   * Composes the props.
   * @returns {Object} The composed props.
   */
  getProps() {
    const classes = withStyles.getClasses(this.props);
    const { grow, shrink } = this.props;
    const className = classNames(this.props.className, classes.root, {
      'common__grid__item--custom-flex': grow !== 0 || shrink !== 1,
    });

    const props = {
      ...this.props,
      className,
    };

    return objectWithoutProps(props, [
      'component',
      'grow',
      'shrink',
      'classes',
    ]);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return React.createElement(this.props.component, this.getProps());
  }
}

export default withStyles(
  GridItem,
  (_theme, props) => ({
    root: {
      ...(props.grow !== 0 ? { flexGrow: props.grow } : {}),
      ...(props.shrink !== 1 ? { flexShrink: props.shrink } : {}),
    },
  })
);
