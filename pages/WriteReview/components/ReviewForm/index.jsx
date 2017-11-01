/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import TextField from 'Components/TextField';
import RatingScale from './components/RatingScale';
import FormButtons from './components/FormButtons';
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
      author: nextProps.review.author ? nextProps.review.author : nextProps.authorName,
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
    return (
      <section className={styles.container}>
        <form onSubmit={this.handleSubmit}>
          <I18n.Text string="reviews.review_form_rate" />
          <RatingScale
            onChange={(rate) => {
              this.setState({ rate });
            }}
            value={this.state.rate}
          />
          <TextField
            id="author"
            name="author"
            label="reviews.review_form_author"
            value={this.state.author}
            onChange={(author) => {
              this.setState({ author });
            }}
          />
          <TextField
            id="title"
            name="title"
            label="reviews.review_form_title"
            value={this.state.title}
            onChange={(title) => {
              this.setState({ title });
            }}
          />
          <TextField
            id="review"
            name="review"
            label="reviews.review_form_text"
            value={this.state.review}
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
