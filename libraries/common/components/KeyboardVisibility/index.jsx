import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Event from '@shopgate/pwa-core/classes/Event';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/pwa-core/constants/AppEvents';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';

/**
 * Component that hides children when the keyboard appears.
 */
class KeyboardVisibility extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    behavior: PropTypes.oneOf(['hide', 'show']),
  }

  static defaultProps = {
    behavior: 'hide',
  }

  /**
   * Initializes the state.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.state = { isVisible: false };
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
   * Stores current keyboard visibility state.
   */
  handleKeyboardChange = ({ open }) => {
    this.setState({ isVisible: open });
  }

  /**
   * Renders the children if keyboard is not visible.
   * @returns {JSX}
   */
  render() {
    if (this.props.behavior === 'hide') {
      return !this.state.isVisible ? this.props.children : null;
    }
    return this.state.isVisible ? this.props.children : null;
  }
}

export default KeyboardVisibility;
