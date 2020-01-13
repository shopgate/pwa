import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import ErrorText from '@shopgate/pwa-ui-shared/TextField/components/ErrorText';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import styles from './style';

/**
 * The rating scale component.
 */
class RatingScale extends Component {
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
   * @param {Object} props The next props.
   * @returns {Object}
   */
  static getDerivedStateFromProps(props) {
    return {
      value: props.value,
    };
  }

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
    const { value } = e.target;
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
