import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * The picker modal.
 */
class PickerModal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  /**
   * The constructor.
   * @param {Object} props The props.
   */
  constructor(props) {
    super(props);

    this.timeout = null;
    this.state = {
      active: true,
    };
  }

  /**
   * Update state when isOpen changes.
   * @param {Object} nextProps The next component props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState({ active: nextProps.isOpen });
    }
  }

  /**
   * Closes the modal after the closing animations have finished.
   */
  closeModal = () => {
    this.setState({ active: false });

    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.props.onClose, styles.duration);
  };

  /**
   * Render all the things!
   * @returns {JSX} The picker modal with the picker list inside.
   */
  render() {
    const backgroundClassName = classNames(
      styles.background.base,
      { [styles.background.inactive]: !this.state.active }
    );

    const containerClassName = classNames(
      styles.container.base,
      { [styles.container.inactive]: !this.state.active }
    );

    return (this.props.isOpen) ? (
      <div
        className={styles.wrapper}
      >
        <div
          aria-hidden
          className={backgroundClassName}
          onClick={this.closeModal}
        />
        <div className={containerClassName}>
          {React.cloneElement(
            this.props.children,
            { onClose: this.closeModal }
          )}
        </div>
      </div>
    ) : null;
  }
}

export default PickerModal;
