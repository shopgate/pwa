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
import { REVIEW_FORM_MAX_LENGTH } from './constants';
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Update state with next props.
   * @param {Object} nextProps The next props
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps.review,
      author: nextProps.review.author ? nextProps.review.author : nextProps.authorName,
    });
  }

  /**
   * Sets the validation error state.
   * @return {boolean} Returns whether the submission was valid or not.
   */
  validate() {
    const errors = {};
    const { __ } = this.context.i18n();

    if (!this.state.rate) {
      errors.rate = __('reviews.review_form_rate_error');
    }

    if (!this.state.author) {
      errors.author = __('reviews.review_form_error_author_empty');
    }

    if (this.state.author.length > REVIEW_FORM_MAX_LENGTH) {
      errors.author = __('reviews.review_form_error_length', { length: REVIEW_FORM_MAX_LENGTH });
    }

    if (this.state.review.length > REVIEW_FORM_MAX_LENGTH) {
      errors.review = __('reviews.review_form_error_length', { length: REVIEW_FORM_MAX_LENGTH });
    }

    if (this.state.title.length > REVIEW_FORM_MAX_LENGTH) {
      errors.title = __('reviews.review_form_error_length', { length: REVIEW_FORM_MAX_LENGTH });
    }

    this.setState({
      validationErrors: { ...errors },
    });

    return !Object.keys(errors).length;
  }

  /**
   * Handles the form submit.
   * @param {Object} e SyntheticEvent
   * @returns {boolean|false}
   */
  handleSubmit(e) {
    e.preventDefault();
    const valid = this.validate();
    if (!valid) {
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
            errorText={this.state.validationErrors.rate}
            value={this.state.rate}
          />
          <TextField
            id="author"
            name="author"
            label="reviews.review_form_author"
            value={this.state.author}
            errorText={this.state.validationErrors.author}
            onChange={(author) => {
              this.setState({ author });
            }}
          />
          <TextField
            id="title"
            name="title"
            label="reviews.review_form_title"
            value={this.state.title}
            errorText={this.state.validationErrors.title}
            onChange={(title) => {
              this.setState({ title });
            }}
          />
          <TextField
            id="review"
            name="review"
            label="reviews.review_form_text"
            value={this.state.review}
            errorText={this.state.validationErrors.review}
            multiLine
            onChange={(review) => {
              this.setState({ review });
            }}
          />
          <FormButtons />
        </form>
      </section>
    );
  }
}

export default connect(ReviewForm);
