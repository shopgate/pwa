/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { history } from '@shopgate/pwa-common/helpers/router';
import RippleButton from 'Components/Button';
import TextField from 'Components/TextField';
import buttonStyles from 'Components/Button/style';
import RatingScale from './components/RatingScale';
import connect from './connector';
import styles from './style';

/**
 * The Review Form.
 */
class ReviewForm extends Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    submit: PropTypes.func.isRequired,
    review: PropTypes.shape(),
  };

  static defaultProps = {
    review: {
      rate: 0,
      author: '',
      title: '',
      review: '',
    },
  };

  /**
   * Navigates back.
   * @returns {boolean}
   */
  static handleCancel() {
    history.go(-1);
    return false;
  }

  /**
   * The Constructor.
   * @param {Object} props The received props.
   */
  constructor(props) {
    super(props);
    this.state = {
      productId: props.productId,
      ...props.review,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  /**
   * Handles the form submit.
   * @param {Object} e SyntheticEvent
   * @returns {boolean|false}
   */
  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.rate) {
      alert('please give rate');
      return false;
    }
    const updateRate = !!this.props.review.rate;
    this.props.submit(this.state, updateRate);
    return false;
  }

  /**
   * Updates a state.
   * @param {string} state - Name of the state.
   * @param {*} val - Value of the state.
   */
  updateState(state, val) {
    const newState = {
      [state]: val,
    };
    this.setState(newState);
  }

  /**
   * Render the form elements.
   * @returns {JSX}
   */
  render() {
    const { rate = 0 } = this.state;
    const buttonStyle = buttonStyles.regular(false);

    return (
      <section className={styles.container}>
        <form onSubmit={this.handleSubmit}>
          <I18n.Text string="reviews.review_form_rate" />
          <RatingScale
            onChange={(val) => {
              this.updateState('rate', val);
            }}
            value={rate}
          />
          <TextField
            id="author"
            name="author"
            label="reviews.review_form_author"
            onChange={(val) => {
              this.updateState('author', val);
            }}
          />
          <TextField
            id="title"
            name="title"
            label="reviews.review_form_title"
            onChange={(val) => {
              this.updateState('title', val);
            }}
          />
          <TextField
            id="review"
            name="review"
            label="reviews.review_form_text"
            type="textarea"
            onChange={(val) => {
              this.updateState('review', val);
            }}
          />
          <div className={styles.buttonLine}>
            <div
              role="button"
              className={`${buttonStyle.button} ${buttonStyle.content}`}
              onClick={this.handleCancel}
            >
              <I18n.Text string="common.cancel" />
            </div>
            <RippleButton type="secondary"><I18n.Text string="common.submit" /></RippleButton>
          </div>
        </form>
      </section>
    );
  }
}

export default connect(ReviewForm);
