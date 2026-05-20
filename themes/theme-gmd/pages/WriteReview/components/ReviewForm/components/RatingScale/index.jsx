import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import ErrorText from '@shopgate/pwa-ui-shared/TextField/components/ErrorText';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  ratingLine: {
    marginBottom: theme.spacing(2.5),
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    position: 'relative',
    float: 'right',
    marginRight: '-0.25em',
    flex: 'none',
  },
  label: {
    flex: 1,
  },
  error: {
    textAlign: 'center',
    clear: 'both',
    bottom: '-1.5em',
    lineHeight: 'initial',
  },
}));

/**
 * The rating scale component.
 * @param {Object} props Component props.
 * @param {string} props.errorText Error message.
 * @param {Function} props.onChange Selection callback.
 * @param {number} props.value Controlled rating value.
 * @returns {JSX.Element}
 */
const RatingScale = ({ errorText, onChange, value: valueProp }) => {
  const { classes } = useStyles();
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const updateValue = useCallback((e) => {
    const { value: next } = e.target;
    setValue(next);
    if (onChange) {
      onChange(next);
    }
  }, [onChange]);

  return (
    <div className={classes.ratingLine}>
      <I18n.Text className={classes.label} string="reviews.review_form_rate" />
      <span className={classes.scale}>
        <RatingStars
          isSelectable
          onSelection={updateValue}
          value={value}
          display="large"
          errorText={errorText}
        />
        <ErrorText
          className={classes.error}
          errorText={errorText}
        />
      </span>
    </div>
  );
};

RatingScale.propTypes = {
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.number,
};

RatingScale.defaultProps = {
  errorText: '',
  onChange: null,
  value: 0,
};

export default RatingScale;
