import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from 'Components/Reviews/components/Header';
import List from 'Components/Reviews/components/List';
import LoadMoreButton from '../LoadMore';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ReviewsContent = ({ productId, rating, reviews }) => (
  <Fragment>
    <Header productId={productId} rating={rating} withTopGap />
    <List productId={productId} reviews={reviews} />
    <LoadMoreButton productId={productId} />
  </Fragment>
);

ReviewsContent.propTypes = {
  productId: PropTypes.string,
  rating: PropTypes.shape(),
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

ReviewsContent.defaultProps = {
  productId: null,
  rating: {},
  reviews: [],
};

export default connect(ReviewsContent);
