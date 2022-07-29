import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * The Accordion container component.
 */
class AccordionContainer extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    open: PropTypes.bool,
  }

  static defaultProps = {
    open: false,
  }

  /**
   * Init
   * @param {Object} props Props
   */
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  // TODO: Deal with in the optimiziation ticket.
  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.state.open !== nextState.open;
  // }

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
      handleClose: this.close,
      open: this.state.open,
      handleOpen: this.open,
    });
  }
}

export default AccordionContainer;
