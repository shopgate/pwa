import React, { Component } from 'react';
import ToggleIcon from '../../ToggleIcon';
import VisibilityIcon from '../../icons/VisibilityIcon';
import VisibilityOffIcon from '../../icons/VisibilityOffIcon';
import TextField from '../TextField';
import style from './style';

/**
 * A component that provides a password field with visibility toggle.
 */
class Password extends Component {
  /**
   * Initializes the component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
    };
  }

  /**
   * @param {boolean} isVisible The next isVisible state.
   */
  togglePasswordVisibility = (isVisible) => {
    this.setState({ isVisible });
  }

  /**
   * @return {*}
   */
  render() {
    const { isVisible } = this.state;

    return (
      <TextField
        {...this.props}
        rightElement={
          <ToggleIcon
            on={isVisible}
            onIcon={<VisibilityIcon size={24} />}
            offIcon={<VisibilityOffIcon size={24} className={style.visOff} />}
            toggleHandler={this.togglePasswordVisibility}
          />
        }
        type={isVisible ? 'text' : 'password'}
      />
    );
  }
}

export default Password;
