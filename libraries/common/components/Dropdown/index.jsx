import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from '../Transition';
import styles from './style';
import transitions from './transitions';

/**
 * This component slides it's child content up or down based on it's isOpen property.
 * @returns {JSX}
 */
class Dropdown extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    duration: PropTypes.number,
    easing: PropTypes.string,
    isOpen: PropTypes.bool,
    onComplete: PropTypes.func,
    onStart: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    children: null,
    duration: 150,
    easing: null,
    isOpen: false,
    onComplete: () => { },
    onStart: () => { },
  };

  /**
   * Constructor
   * @param {Object} props Props of the Component
   */
  constructor(props) {
    super(props);

    this.state = {
      initialRender: true,
    };
  }

  /**
   * Update the initialRender state if the isOpen state changes from false to true
   * @param {Object} nextProps The new props
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isOpen === false && nextProps.isOpen === true) {
      this.setState({
        initialRender: false,
      });
    }
  }

  /**
   * Only update the component if isOpen changed
   * @param {Object} nextProps The new props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return this.props.isOpen !== nextProps.isOpen;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    let transitionProps;

    if (this.props.isOpen) {
      transitionProps = this.state.initialRender ? transitions.initialOpen : transitions.open;
    } else {
      transitionProps = this.state.initialRender ? transitions.initialClose : transitions.close;
    }

    return (
      <Transition
        {...transitionProps}
        onComplete={this.props.onComplete}
        onStart={this.props.onStart}
        duration={this.props.duration}
        easing={this.props.easing}
      >
        <div className={`${styles} ${this.props.className}`} aria-hidden={!this.props.isOpen}>
          {this.props.children}
        </div>
      </Transition>
    );
  }
}

export default Dropdown;
