import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@shopgate/engage/styles';
import { objectWithoutProps } from '../../helpers/data';
import GridItem from './components/Item';

/**
 * The grid component.
 */
class Grid extends Component {
  static Item = GridItem;

  static propTypes = {
    className: PropTypes.string,
    component: PropTypes.string,
    wrap: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    component: 'ul',
    wrap: false,
  };

  /**
   * Composes the props.
   * @returns {Object} The composed props.
   */
  getProps() {
    const classes = withStyles.getClasses(this.props);
    let className = `${this.props.className} ${classes.root} common__grid`;

    if (this.props.wrap) {
      className += ` ${classes.wrap}`;
    } else {
      className += ` ${classes.noWrap}`;
    }

    const props = {
      ...this.props,
      className,
    };

    return objectWithoutProps(props, [
      'wrap',
      'component',
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

const StyledGrid = withStyles(Grid, () => ({
  root: {
    display: 'flex',
    minWidth: '100%',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  noWrap: {
    flexWrap: 'nowrap',
  },
}));

StyledGrid.Item = GridItem;

export default StyledGrid;
