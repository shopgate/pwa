import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Event from '@shopgate/pwa-core/classes/Event';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/pwa-core/constants/AppEvents';

/**
 * Keyboard state consumer.
 */
class KeyboardConsumer extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  state = {
    open: false,
    overlap: 0,
    duration: 0,
  };

  /**
   * Listen to keyboard changes as soon as the component mounts.
   */
  componentDidMount() {
    Event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
  }

  /**
   * Remove listener when component will unmount.
   */
  componentWillUnmount() {
    Event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, this.handleKeyboardChange);
  }

  /**
   * Stores current keyboard state.
   */
  handleKeyboardChange = ({ open, overlap, duration }) => {
    this.setState({ open, overlap, duration });
  }

  /**
   * @returns {JSX}
   */
  render() {
    return this.props.children(this.state);
  }
}

export default KeyboardConsumer;
