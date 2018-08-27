import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Th Accordion component.
 */
class Accordion extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  state = {
    open: false,
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.open !== nextState.open;
  }

  open = () => {
    this.setState({ open: true });
  }

  close = () => {
    this.setState({ open: false });
  }

  /**
   * @returns {JSX}
   */
  render() {
    return this.props.children({
      close: this.close,
      isOpen: this.state.open,
      open: this.open,
    });
  }
}

export default Accordion;
