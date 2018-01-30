/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RatingStars from 'Components/RatingStars';
import ErrorText from 'Components/TextField/components/ErrorText';
import styles from './style';

/**
 * The rating scale component.
 */
class RatingScale extends React.Component {
  static propTypes = {
    errorText: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number,
  };

  static defaultProps = {
    errorText: '',
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
   * Update state with next props.
   * @param {Object} nextProps The next props
   */
  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
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
      <div className={styles.ratingLine}>
        <I18n.Text className={styles.label} string="reviews.review_form_rate" />
        <span className={styles.scale}>
          <RatingStars
            isSelectable
            onSelection={this.updateValue}
            value={this.state.value}
            display="large"
            errorText={this.props.errorText}
          />
          <ErrorText
            className={styles.error}
            errorText={this.props.errorText}
          />
        </span>
      </div>
    );
  }
}

export default RatingScale;
