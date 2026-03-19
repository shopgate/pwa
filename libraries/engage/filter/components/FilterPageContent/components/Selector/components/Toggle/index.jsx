import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@shopgate/engage/styles';

/**
 * The toggle component.
 */
class Toggle extends PureComponent {
  static propTypes = {
    label: PropTypes.node.isRequired,
    open: PropTypes.bool,
    selected: PropTypes.node,
  };

  static defaultProps = {
    open: false,
    selected: null,
  };

  /**
   * @returns {string}
   */
  get className() {
    const classes = withStyles.getClasses(this.props);
    const { open } = this.props;

    return classNames({
      [classes.label]: true,
      [classes.open]: open,
      [classes.closed]: !open,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const classes = withStyles.getClasses(this.props);
    const { label, selected } = this.props;

    return (
      <div className={classes.toggle}>
        <span className={this.className}>
          {label}
        </span>
        {selected && (
          <span className={classes.selected}>{selected}</span>
        )}
      </div>
    );
  }
}

export default withStyles(
  Toggle,
  () => ({
    toggle: {
      display: 'flex',
      flexFlow: 'row no-wrap',
      alignContent: 'stretch',
      alignItems: 'flex-start',
    },
    label: {
      whiteSpace: 'no-wrap',
      flexShrink: 0,
      flexGrow: 1,
      textAlign: 'left',
      maxWidth: '50%',
      minWidth: '35%',
      paddingRight: '16px',
    },
    selected: {
      display: 'flex',
      flexFlow: 'row wrap',
      flexGrow: 1,
      justifyContent: 'flex-end',
      minWidth: '50%',
      maxWidth: '65%',
    },
    closed: {
      fontWeight: 'normal',
    },
    open: {
      fontWeight: 'bold',
    },
  })
);
