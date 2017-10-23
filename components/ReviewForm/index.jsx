/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { history } from '@shopgate/pwa-common/helpers/router';
import RatingStars from 'Components/RatingStars';
import Button from 'Components/Button';
import TextField from 'Components/TextField';
import styles from './style';

const handleClick = () => {
  history.go(-1);
  return false;
};

const handleSubmit = () => {
  alert('submit');
  return false;
};

const ReviewForm = ({ review }) => {
  const { rate = 0 } = review;

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <I18n.Text string="reviews.rate_product" /> <RatingStars value={rate} display="big" />

      <TextField name="user_name" label="reviews.review_form_name" />
      <TextField name="title" label="reviews.review_form_title" />
      <TextField type="textarea" name="text" label="reviews.review_form_text" />

      <div className={styles.buttonLine}>
        <div className={styles.button} onClick={handleClick}>
          <I18n.Text string="common.cancel" />
        </div>
        <Button><I18n.Text string="common.submit" /></Button>
      </div>
    </form>
  );
};

ReviewForm.propTypes = {
  review: PropTypes.shape(),
};

ReviewForm.defaultProps = {
  review: {},
};

export default ReviewForm;
