import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Event from '@shopgate/pwa-core/classes/Event';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/pwa-core/constants/AppEvents';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';

/**
 * Keyboard state consumer.
 */
class KeyboardConsumer extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }
  /**
   * Initializes the state.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      overlap: 0,
      duration: 0,
    };
    registerEvents([EVENT_KEYBOARD_WILL_CHANGE]);
  }

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
   * Renders the children if keyboard is not visible.
   * @returns {JSX}
   */
  render() {
    return this.props.children(this.state);
  }
}

export default KeyboardConsumer;
