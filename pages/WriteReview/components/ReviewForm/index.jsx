/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'Components/TextField';
import RatingScale from './components/RatingScale';
import FormButtons from './components/FormButtons';
import {
  REVIEW_FORM_MAX_LENGTH,
  FIELD_NAME_AUTHOR,
  FIELD_NAME_RATE,
  FIELD_NAME_REVIEW,
  FIELD_NAME_TITLE,
} from './constants';
import connect from './connector';
import styles from './style';

/**
 * The Review Form.
 */
class ReviewForm extends Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    submit: PropTypes.func.isRequired,
    authorName: PropTypes.string,
    review: PropTypes.shape(),
  };

  static defaultProps = {
    authorName: '',
    review: {},
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * The Constructor.
   * @param {Object} props The received props.
   */
  constructor(props) {
    super(props);
    this.state = {
      ...props.review,
      productId: props.productId,
      validationErrors: {},
    };
    this.tmpErrors = null;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Update state with next props.
   * @param {Object} nextProps The next props
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps.review,
      [FIELD_NAME_AUTHOR]: nextProps.review[FIELD_NAME_AUTHOR] || nextProps.authorName,
    });
  }

  /**
   * Gets current validation errors.
   * @return {null|*|{}}
   */
  get validationErrors() {
    return this.tmpErrors || { ...this.state.validationErrors };
  }

  /**
   * Sets the validation error state.
   * @return {boolean} Returns whether the submission was valid or not.
   */
  get formValid() {
    // Store errors to validate all fields at once.
    this.tmpErrors = this.validationErrors;

    const valid = this.validateRate()
      && this.validateAuthor()
      && this.validateLength(FIELD_NAME_AUTHOR)
      && this.validateLength(FIELD_NAME_TITLE)
      && this.validateLength(FIELD_NAME_REVIEW);
    this.tmpErrors = null;
    return valid;
  }

  /**
   * Validate rate.
   * @param {Object} scope The data to be validated.
   * @return {boolean} Valid or invalid data provided.
   */
  validateRate(scope = this.state) {
    const { __ } = this.context.i18n();
    const validationErrors = this.validationErrors;

    if (!scope.rate) {
      validationErrors[FIELD_NAME_RATE] = __('reviews.review_form_rate_error');
    } else {
      delete validationErrors[FIELD_NAME_RATE];
    }

    this.setState({ validationErrors });

    return !validationErrors[FIELD_NAME_RATE];
  }

  /**
   * Validates the author.
   * @param {Object} scope The data to be validated.
   * @return {boolean} Valid or invalid data provided.
   */
  validateAuthor(scope = this.state) {
    const { __ } = this.context.i18n();
    const validationErrors = this.validationErrors;

    if (!scope[FIELD_NAME_AUTHOR]) {
      validationErrors[FIELD_NAME_AUTHOR] = __('reviews.review_form_error_author_empty');
    } else if (scope[FIELD_NAME_AUTHOR].length > REVIEW_FORM_MAX_LENGTH) {
      validationErrors[FIELD_NAME_AUTHOR] =
        __('reviews.review_form_error_length', { length: REVIEW_FORM_MAX_LENGTH });
    } else {
      delete validationErrors[FIELD_NAME_AUTHOR];
    }

    this.setState({ validationErrors });

    return !validationErrors[FIELD_NAME_AUTHOR];
  }

  /**
   * Length validation.
   * @param {string} field The field name.
   * @param {Object} scope The data to be validated.
   * @return {boolean} Valid or invalid data provided.
   */
  validateLength(field, scope = this.state) {
    const { __ } = this.context.i18n();
    const validationErrors = this.validationErrors;

    if (scope[field] && scope[field].length > REVIEW_FORM_MAX_LENGTH) {
      validationErrors[field] =
        __('reviews.review_form_error_length', { length: REVIEW_FORM_MAX_LENGTH });
    } else {
      delete validationErrors[field];
    }

    this.setState({ validationErrors });

    return !validationErrors[field];
  }

  /**
   * Handles the form submit.
   * @param {Object} e SyntheticEvent
   * @returns {boolean|false}
   */
  handleSubmit(e) {
    e.preventDefault();
    if (!this.formValid) {
      return false;
    }

    const updateRate = !!this.props.review.rate;
    this.props.submit(this.state, updateRate);
    return false;
  }

  /**
   * Render the form elements.
   * @returns {JSX}
   */
  render() {
    return (
      <section className={styles.container}>
        <form onSubmit={this.handleSubmit}>
          <RatingScale
            onChange={(rate) => {
              this.setState({ rate });
            }}
            errorText={this.state.validationErrors[FIELD_NAME_RATE]}
            value={this.state[FIELD_NAME_RATE]}
          />
          <TextField
            id={FIELD_NAME_AUTHOR}
            name={FIELD_NAME_AUTHOR}
            label="reviews.review_form_author"
            value={this.state[FIELD_NAME_AUTHOR]}
            errorText={this.state.validationErrors[FIELD_NAME_AUTHOR]}
            onChange={(author) => {
              this.setState({ author });
              this.validateAuthor({ author });
            }}
          />
          <TextField
            id={FIELD_NAME_TITLE}
            name={FIELD_NAME_TITLE}
            label="reviews.review_form_title"
            value={this.state[FIELD_NAME_TITLE]}
            errorText={this.state.validationErrors[FIELD_NAME_TITLE]}
            onChange={(title) => {
              this.setState({ title });
              this.validateLength(FIELD_NAME_TITLE, { title });
            }}
          />
          <TextField
            id={FIELD_NAME_REVIEW}
            name={FIELD_NAME_REVIEW}
            label="reviews.review_form_text"
            value={this.state[FIELD_NAME_REVIEW]}
            errorText={this.state.validationErrors[FIELD_NAME_REVIEW]}
            multiLine
            onChange={(review) => {
              this.setState({ review });
              this.validateLength(FIELD_NAME_REVIEW, { review });
            }}
          />
          <FormButtons />
        </form>
      </section>
    );
  }
}

export default connect(ReviewForm);
