import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { withWidgetSettings } from '@shopgate/engage/core/hocs';
import { makeStyles } from '@shopgate/engage/styles';
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

const useStyles = makeStyles()(theme => ({
  container: {
    margin: theme.spacing(2),
  },
}));

const VALIDATION_LENGTHS = {
  [FIELD_NAME_AUTHOR]: DEFAULT_FORM_MAX_LENGTH,
  [FIELD_NAME_TITLE]: DEFAULT_FORM_MAX_LENGTH,
  [FIELD_NAME_REVIEW]: REVIEW_TEXT_MAX_LENGTH,
};

/**
 * @param {string} field Field key.
 * @param {Object} scope Source values (state slice or override).
 * @param {Object} validationErrors Previous error map.
 * @returns {Object}
 */
const applyValidateLength = (field, scope, validationErrors) => {
  const next = { ...validationErrors };
  const length = VALIDATION_LENGTHS[field];

  if (length && scope[field] && scope[field].length >= length) {
    next[field] = i18n.text('reviews.review_form_error_length', { length });
  } else {
    delete next[field];
  }

  return next;
};

/**
 * @param {Object} scope Source values.
 * @param {Object} validationErrors Previous error map.
 * @returns {Object}
 */
const applyValidateAuthor = (scope, validationErrors) => {
  const next = { ...validationErrors };
  const length = VALIDATION_LENGTHS[FIELD_NAME_AUTHOR];

  if (!scope[FIELD_NAME_AUTHOR] || !scope[FIELD_NAME_AUTHOR].length) {
    next[FIELD_NAME_AUTHOR] = i18n.text('reviews.review_form_error_author_empty');
  } else if (length && scope[FIELD_NAME_AUTHOR].length > length) {
    next[FIELD_NAME_AUTHOR] = i18n.text('reviews.review_form_error_length', { length });
  } else {
    delete next[FIELD_NAME_AUTHOR];
  }

  return next;
};

/**
 * Legacy class used `scope.rate` (see handleRatingChange({ rate })).
 * @param {Object} scope Source values.
 * @param {Object} validationErrors Previous error map.
 * @returns {Object}
 */
const applyValidateRate = (scope, validationErrors) => {
  const next = { ...validationErrors };

  if (!scope.rate) {
    next[FIELD_NAME_RATE] = i18n.text('reviews.review_form_rate_error');
  } else {
    delete next[FIELD_NAME_RATE];
  }

  return next;
};

/**
 * Matches legacy `formValid` getter order: rate, author, length(author|title|review).
 * @param {Object} state Form state including validationErrors.
 * @returns {{ validationErrors: Object, valid: boolean }}
 */
const computeFormValidation = (state) => {
  let validationErrors = { ...state.validationErrors };
  validationErrors = applyValidateRate(state, validationErrors);
  validationErrors = applyValidateAuthor(state, validationErrors);
  validationErrors = applyValidateLength(FIELD_NAME_AUTHOR, state, validationErrors);
  validationErrors = applyValidateLength(FIELD_NAME_TITLE, state, validationErrors);
  validationErrors = applyValidateLength(FIELD_NAME_REVIEW, state, validationErrors);
  return {
    validationErrors,
    valid: !Object.keys(validationErrors).length,
  };
};

/**
 * Review form (functional equivalent of legacy PureComponent + UNSAFE_componentWillReceiveProps).
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const ReviewForm = ({
  authorName,
  isLoadingUserReview,
  productId,
  review,
  submit,
  widgetSettings,
}) => {
  const { classes } = useStyles();
  const [formState, setFormState] = useState(() => ({
    ...review,
    productId,
    validationErrors: {},
  }));

  /**
   * `getUserReviewForProduct` returns a new object when `reviewsById` changes; depending on
   * `review` by reference would re-sync on unrelated review entities. Match server payload only.
   */
  const reviewFingerprint = JSON.stringify(review ?? {});

  useEffect(() => {
    const author = review[FIELD_NAME_AUTHOR];
    const prefilledAuthor = widgetSettings.prefillAuthor !== false ? authorName : '';
    setFormState(prev => ({
      ...prev,
      productId,
      ...review,
      ...(!prev[FIELD_NAME_AUTHOR] && { [FIELD_NAME_AUTHOR]: (author || prefilledAuthor) }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, authorName, widgetSettings, reviewFingerprint]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setFormState((prev) => {
      const { valid, validationErrors } = computeFormValidation(prev);
      if (!valid) {
        return {
          ...prev,
          validationErrors,
        };
      }
      submit({
        ...prev,
        validationErrors: {},
      }, !!review.rate);
      return {
        ...prev,
        validationErrors: {},
      };
    });
  }, [submit, review.rate]);

  const handleRatingChange = useCallback((rate) => {
    setFormState((prev) => {
      const validationErrors = applyValidateRate(
        {
          ...prev,
          rate,
        },
        { ...prev.validationErrors }
      );
      return {
        ...prev,
        [FIELD_NAME_RATE]: rate,
        validationErrors,
      };
    });
  }, []);

  const handleAuthorChange = useCallback((author) => {
    setFormState((prev) => {
      const validationErrors = applyValidateLength(
        FIELD_NAME_AUTHOR,
        { [FIELD_NAME_AUTHOR]: author },
        { ...prev.validationErrors }
      );
      return {
        ...prev,
        [FIELD_NAME_AUTHOR]: author,
        validationErrors,
      };
    });
  }, []);

  const handleTitleChange = useCallback((title) => {
    setFormState((prev) => {
      const validationErrors = applyValidateLength(
        FIELD_NAME_TITLE,
        { [FIELD_NAME_TITLE]: title },
        { ...prev.validationErrors }
      );
      return {
        ...prev,
        [FIELD_NAME_TITLE]: title,
        validationErrors,
      };
    });
  }, []);

  const handleReviewChange = useCallback((reviewText) => {
    setFormState((prev) => {
      const validationErrors = applyValidateLength(
        FIELD_NAME_REVIEW,
        { [FIELD_NAME_REVIEW]: reviewText },
        { ...prev.validationErrors }
      );
      return {
        ...prev,
        [FIELD_NAME_REVIEW]: reviewText,
        validationErrors,
      };
    });
  }, []);

  if (productId === null) {
    return null;
  }

  if (isLoadingUserReview && !formState.rate) {
    return <LoadingIndicator />;
  }

  const { validationErrors } = formState;

  return (
    <section className={classes.container} data-test-id="reviewForm">
      <form onSubmit={handleSubmit}>
        <RatingScale
          onChange={handleRatingChange}
          errorText={validationErrors[FIELD_NAME_RATE]}
          value={formState[FIELD_NAME_RATE]}
        />
        <TextField
          id={FIELD_NAME_AUTHOR}
          name={FIELD_NAME_AUTHOR}
          label="reviews.review_form_author"
          value={formState[FIELD_NAME_AUTHOR]}
          errorText={validationErrors[FIELD_NAME_AUTHOR]}
          onChange={handleAuthorChange}
        />
        <TextField
          id={FIELD_NAME_TITLE}
          name={FIELD_NAME_TITLE}
          label="reviews.review_form_title"
          value={formState[FIELD_NAME_TITLE]}
          errorText={validationErrors[FIELD_NAME_TITLE]}
          onChange={handleTitleChange}
        />
        <TextField
          id={FIELD_NAME_REVIEW}
          name={FIELD_NAME_REVIEW}
          label="reviews.review_form_text"
          value={formState[FIELD_NAME_REVIEW]}
          errorText={validationErrors[FIELD_NAME_REVIEW]}
          multiLine
          onChange={handleReviewChange}
        />
        <FormButtons />
      </form>
    </section>
  );
};

ReviewForm.propTypes = {
  isLoadingUserReview: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  authorName: PropTypes.string,
  productId: PropTypes.string,
  review: PropTypes.shape(),
  widgetSettings: PropTypes.shape(),
};

ReviewForm.defaultProps = {
  authorName: '',
  productId: null,
  review: {},
  widgetSettings: {
    prefillAuthor: true,
  },
};

export default withWidgetSettings(connect(ReviewForm), '@shopgate/engage/reviews');
