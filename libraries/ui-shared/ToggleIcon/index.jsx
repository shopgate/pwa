import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * No operational default handler
 */
const noop = () => {};

/**
 * An toggle icon with toggle handlers.
 */
class ToggleIcon extends Component {
  static propTypes = {
    /* Off icon from icons library */
    offIcon: PropTypes.element.isRequired,
    /* On icon from icons library */
    onIcon: PropTypes.element.isRequired,
    /* Initial state, default is true */
    on: PropTypes.bool,
    /** Will be called with true|false whe toggle is changed. Default is noop */
    toggleHandler: PropTypes.func,
  };

  static defaultProps = {
    on: true,
    toggleHandler: noop,
  };

  /**
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      on: props.on,
    };
  }

  /**
   * Reset state to received props
   * @param {Object} nextProps next props
   */
  componentWillReceiveProps(nextProps) {
    this.setState({ on: nextProps.on });
  }

  /**
   * Toggle icon
   */
  handleToggle = () => {
    this.setState(({ on }) => ({ on: !on }), () => this.props.toggleHandler(this.state.on));
  };

  /**
   * @return {*}
   */
  render() {
    const { onIcon, offIcon } = this.props;
    const { on } = this.state;
    return (
      <div onClick={this.handleToggle} aria-hidden>
        {on && onIcon}
        {!on && offIcon}
      </div>
    );
  }
}

export default ToggleIcon;
