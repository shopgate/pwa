/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from 'Components/RatingStars';
import styles from './style';

/**
 * The Rating scale component.
 */
class RatingScale extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
  };

  static defaultProps = {
    onChange: null,
    value: 0,
  };

  /**
   * Construct and bind methods.
   * @param {Object} props Received props.
   */
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.updateValue = this.updateValue.bind(this);
  }

  /**
   * Updates the state value.
   * @param {SyntheticEvent} e SyntheticEvent.
   */
  updateValue(e) {
    const value = e.target.value;
    this.setState({ value });
    this.props.onChange(value);
  }

  /**
   * Renders rating stars as form element.
   * @returns {JSX}
   */
  render() {
    return (
      <RatingStars
        isFormElement
        className={styles.ratingLine}
        onSelection={this.updateValue}
        value={this.state.value}
        display="large"
      />
    );
  }
}

export default RatingScale;
