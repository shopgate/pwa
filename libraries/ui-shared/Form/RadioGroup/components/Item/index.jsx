import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import I18n from '@shopgate/pwa-common/components/I18n';
import style from './style';

/**
 * RadioItem component.
 */
class RadioItem extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    active: false,
    onChange: () => {},
  }

  /**
   * Initializes the component
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.id = `${props.name}${Math.random()}`;
  }

  /**
   * Renders the icon.
   * @returns {JSX}
   */
  renderIcon() {
    return this.props.active ?
      <CheckedIcon className={style.active} /> :
      <UncheckedIcon />;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      active, label, name, onChange,
    } = this.props;

    return (
      <label className={style.container} htmlFor={this.id}>
        {this.renderIcon()}
        <input
          className={style.input}
          checked={active}
          type="radio"
          id={this.id}
          name={name}
          onChange={onChange}
        />
        <I18n.Text className={style.label} string={label} />
      </label>
    );
  }
}

export default RadioItem;
