import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { withWidgetSettings } from '@shopgate/engage/core/hocs';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
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

const { variables } = themeConfig;

const VALIDATION_LENGTHS = {
  [FIELD_NAME_AUTHOR]: DEFAULT_FORM_MAX_LENGTH,
  [FIELD_NAME_TITLE]: DEFAULT_FORM_MAX_LENGTH,
  [FIELD_NAME_REVIEW]: REVIEW_TEXT_MAX_LENGTH,
};

const useStyles = makeStyles()(() => ({
  container: {
    margin: `${variables.gap.big}px`,
  },
}));

/**
 * @param {Object} scope Form field slice.
 * @param {Object} prevErrors Previous validation map.
 * @returns {Object}
 */
const validateRate = (scope, prevErrors) => {
  const next = { ...prevErrors };
  if (!scope[FIELD_NAME_RATE]) {
    next[FIELD_NAME_RATE] = i18n.text('reviews.review_form_rate_error');
  } else {
    delete next[FIELD_NAME_RATE];
  }
  return next;
};

/**
 * @param {string} field Field key.
 * @param {Object} scope Form field slice.
 * @param {Object} prevErrors Previous validation map.
 * @returns {Object}
 */
const validateFieldLength = (field, scope, prevErrors) => {
  const next = { ...prevErrors };
  const length = VALIDATION_LENGTHS[field];
  if (length && scope[field] && scope[field].length >= length) {
    next[field] = i18n.text('reviews.review_form_error_length', { length });
  } else {
    delete next[field];
  }
  return next;
};

/**
 * Full validation for submit (matches legacy getter order / rules).
 * @param {Object} state Form state including validationErrors.
 * @returns {Object}
 */
const computeSubmitValidationErrors = (state) => {
  const errors = {};
  if (!state[FIELD_NAME_RATE]) {
    errors[FIELD_NAME_RATE] = i18n.text('reviews.review_form_rate_error');
  }
  const author = state[FIELD_NAME_AUTHOR];
  const authorLen = VALIDATION_LENGTHS[FIELD_NAME_AUTHOR];
  if (!author || !author.length) {
    errors[FIELD_NAME_AUTHOR] = i18n.text('reviews.review_form_error_author_empty');
  } else if (authorLen && author.length > authorLen) {
    errors[FIELD_NAME_AUTHOR] = i18n.text('reviews.review_form_error_length', { length: authorLen });
  }
  if (authorLen && author && author.length >= authorLen) {
    errors[FIELD_NAME_AUTHOR] = i18n.text('reviews.review_form_error_length', { length: authorLen });
  }
  const titleLen = VALIDATION_LENGTHS[FIELD_NAME_TITLE];
  if (titleLen && state[FIELD_NAME_TITLE] && state[FIELD_NAME_TITLE].length >= titleLen) {
    errors[FIELD_NAME_TITLE] = i18n.text('reviews.review_form_error_length', { length: titleLen });
  }
  const reviewLen = VALIDATION_LENGTHS[FIELD_NAME_REVIEW];
  if (reviewLen && state[FIELD_NAME_REVIEW] && state[FIELD_NAME_REVIEW].length >= reviewLen) {
    errors[FIELD_NAME_REVIEW] = i18n.text('reviews.review_form_error_length', { length: reviewLen });
  }
  return errors;
};

/**
 * Review form component.
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
  const skipFirstPropsSync = useRef(true);
  const [formState, setFormState] = useState(() => ({
    ...review,
    productId,
    validationErrors: {},
  }));

  useEffect(() => {
    if (skipFirstPropsSync.current) {
      skipFirstPropsSync.current = false;
      return;
    }
    const author = review[FIELD_NAME_AUTHOR];
    const prefilledAuthor = widgetSettings.prefillAuthor !== false ? authorName : '';
    setFormState(prev => ({
      ...prev,
      productId,
      ...review,
      ...(!prev[FIELD_NAME_AUTHOR] && { [FIELD_NAME_AUTHOR]: (author || prefilledAuthor) }),
    }));
  }, [productId, review, authorName, widgetSettings]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setFormState((prev) => {
      const validationErrors = computeSubmitValidationErrors(prev);
      if (Object.keys(validationErrors).length) {
        return {
          ...prev,
          validationErrors,
        };
      }
      submit(prev, !!review.rate);
      return {
        ...prev,
        validationErrors: {},
      };
    });
  }, [submit, review.rate]);

  const handleRatingChange = useCallback((rate) => {
    setFormState((prev) => {
      const validationErrors = validateRate(
        {
          ...prev,
          [FIELD_NAME_RATE]: rate,
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
      const validationErrors = validateFieldLength(
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
      const validationErrors = validateFieldLength(
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
      const validationErrors = validateFieldLength(
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

  if (isLoadingUserReview && !formState[FIELD_NAME_RATE]) {
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
