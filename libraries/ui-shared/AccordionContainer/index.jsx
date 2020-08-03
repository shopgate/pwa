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
