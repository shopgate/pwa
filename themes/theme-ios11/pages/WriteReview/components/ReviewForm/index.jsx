import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import RatingScale from './components/RatingScale';
import FormButtons from './components/FormButtons';
import {
  DEFAULT_FORM_MAX_LENGTH,
  REVIEW_TEXT_MAX_LENGTH,
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
class ReviewForm extends PureComponent {
  static validationLengths = {
    [FIELD_NAME_AUTHOR]: DEFAULT_FORM_MAX_LENGTH,
    [FIELD_NAME_TITLE]: DEFAULT_FORM_MAX_LENGTH,
    [FIELD_NAME_REVIEW]: REVIEW_TEXT_MAX_LENGTH,
  };

  static propTypes = {
    isLoadingUserReview: PropTypes.bool.isRequired,
    submit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    authorName: PropTypes.string,
    productId: PropTypes.string,
    review: PropTypes.shape(),
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  static defaultProps = {
    authorName: '',
    productId: null,
    review: {},
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
  }

  /**
   * Sets the validation error state.
   * @return {boolean} Returns whether the submission was valid or not.
   */
  get formValid() {
    const validationErrors = {
      ...this.validateRate(),
      ...this.validateAuthor(),
      ...this.validateLength(FIELD_NAME_AUTHOR),
      ...this.validateLength(FIELD_NAME_TITLE),
      ...this.validateLength(FIELD_NAME_REVIEW),
    };

    this.setState({ validationErrors });

    return !Object.keys(validationErrors).length;
  }

  /**
   * Handles the form submit.
   * @param {SyntheticEvent} event The submit event object.
   */
  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.formValid) {
      return;
    }

    this.props.submit(this.state, !!this.props.review.rate);
  }

  /**
   * @param {number} rate The changed rate.
   */
  handleRatingChange = (rate) => {
    const validationErrors = this.validateRate({ rate });

    this.setState({
      [FIELD_NAME_RATE]: rate,
      validationErrors,
    });
  }

  /**
   * @param {string} author The review author.
   */
  handleAuthorChange = (author) => {
    const validationErrors = this.validateLength(FIELD_NAME_AUTHOR, { author });

    this.setState({
      [FIELD_NAME_AUTHOR]: author,
      validationErrors,
    });
  }

  /**
   * @param {string} title The review title.
   */
  handleTitleChange = (title) => {
    const validationErrors = this.validateLength(FIELD_NAME_TITLE, { title });

    this.setState({
      [FIELD_NAME_TITLE]: title,
      validationErrors,
    });
  }

  /**
   * @param {string} review The review content.
   */
  handleReviewChange = (review) => {
    const validationErrors = this.validateLength(FIELD_NAME_REVIEW, { review });

    this.setState({
      [FIELD_NAME_REVIEW]: review,
      validationErrors,
    });
  }

  /**
   * Update state with next props.
   * @param {Object} nextProps The next props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    const { productId, review, authorName } = nextProps;
    const author = review[FIELD_NAME_AUTHOR];

    this.setState(prevState => ({
      productId,
      ...review,
      ...!prevState[FIELD_NAME_AUTHOR] && { [FIELD_NAME_AUTHOR]: (author || authorName) },
    }));
  }

  /**
   * Length validation.
   * @param {string} field The field name.
   * @param {Object} scope The data to be validated.
   * @return {boolean} Valid or invalid data provided.
   */
  validateLength(field, scope = this.state) {
    const { __ } = this.context.i18n();
    const { validationErrors } = this.state;
    const length = this.constructor.validationLengths[field];

    if (length && scope[field] && scope[field].length >= length) {
      validationErrors[field] = __('reviews.review_form_error_length', { length });
    } else {
      delete validationErrors[field];
    }

    return validationErrors;
  }

  /**
   * Validates the author.
   * @param {Object} scope The data to be validated.
   * @return {boolean} Valid or invalid data provided.
   */
  validateAuthor(scope = this.state) {
    const { __ } = this.context.i18n();
    const { validationErrors } = this.state;
    const length = this.constructor.validationLengths[FIELD_NAME_AUTHOR];

    if (!scope[FIELD_NAME_AUTHOR] || !scope[FIELD_NAME_AUTHOR].length) {
      validationErrors[FIELD_NAME_AUTHOR] = __('reviews.review_form_error_author_empty');
    } else if (length && scope[FIELD_NAME_AUTHOR].length > length) {
      validationErrors[FIELD_NAME_AUTHOR] = __('reviews.review_form_error_length', { length });
    } else {
      delete validationErrors[FIELD_NAME_AUTHOR];
    }

    return validationErrors;
  }

  /**
   * Validate rate.
   * @param {Object} scope The data to be validated.
   * @return {boolean} Valid or invalid data provided.
   */
  validateRate(scope = this.state) {
    const { __ } = this.context.i18n();
    const { validationErrors } = this.state;

    if (!scope.rate) {
      validationErrors[FIELD_NAME_RATE] = __('reviews.review_form_rate_error');
    } else {
      delete validationErrors[FIELD_NAME_RATE];
    }

    return validationErrors;
  }

  /**
   * Render the form elements.
   * @returns {JSX}
   */
  render() {
    if (this.props.productId === null) {
      return null;
    }

    /**
     * Show loading indicator only when review is initially loading and user
     * didn't interact with the form.
     * Rate is a good indicator for that since it's the only property of review which is
     * required and has no default value.
     */
    if (this.props.isLoadingUserReview && !this.state.rate) {
      return <LoadingIndicator />;
    }

    const { validationErrors } = this.state;

    return (
      <section className={styles.container} data-test-id="reviewForm">
        <form onSubmit={this.handleSubmit}>
          <RatingScale
            onChange={this.handleRatingChange}
            errorText={validationErrors[FIELD_NAME_RATE]}
            value={this.state[FIELD_NAME_RATE]}
          />
          <TextField
            id={FIELD_NAME_AUTHOR}
            name={FIELD_NAME_AUTHOR}
            label="reviews.review_form_author"
            value={this.state[FIELD_NAME_AUTHOR]}
            errorText={validationErrors[FIELD_NAME_AUTHOR]}
            onChange={this.handleAuthorChange}
          />
          <TextField
            id={FIELD_NAME_TITLE}
            name={FIELD_NAME_TITLE}
            label="reviews.review_form_title"
            value={this.state[FIELD_NAME_TITLE]}
            errorText={validationErrors[FIELD_NAME_TITLE]}
            onChange={this.handleTitleChange}
          />
          <TextField
            id={FIELD_NAME_REVIEW}
            name={FIELD_NAME_REVIEW}
            label="reviews.review_form_text"
            value={this.state[FIELD_NAME_REVIEW]}
            errorText={validationErrors[FIELD_NAME_REVIEW]}
            multiLine
            onChange={this.handleReviewChange}
          />
          <FormButtons />
        </form>
      </section>
    );
  }
}

export default connect(ReviewForm);
