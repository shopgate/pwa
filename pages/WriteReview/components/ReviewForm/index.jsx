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
    authorName: PropTypes.string,
    review: PropTypes.shape(),
  };

  static defaultProps = {
    authorName: '',
    review: {},
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
      ...props.review,
      productId: props.productId,
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
      author: nextProps.review.author ? nextProps.review.author : this.props.authorName,
    });
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
   * Render the form elements.
   * @returns {JSX}
   */
  render() {
    const buttonStyle = buttonStyles.regular(false);

    return (
      <section className={styles.container}>
        <form onSubmit={this.handleSubmit}>
          <I18n.Text string="reviews.review_form_rate" />
          <RatingScale
            onChange={(val) => {
              this.setState({ rate: val });
            }}
            value={this.state.rate}
          />
          <TextField
            id="author"
            name="author"
            label="reviews.review_form_author"
            value={this.state.author}
            onChange={(val) => {
              this.setState({ author: val });
            }}
          />
          <TextField
            id="title"
            name="title"
            label="reviews.review_form_title"
            value={this.state.title}
            onChange={(val) => {
              this.setState({ title: val });
            }}
          />
          <TextField
            id="review"
            name="review"
            label="reviews.review_form_text"
            value={this.state.review}
            multiLine
            onChange={(val) => {
              this.setState({ review: val });
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
