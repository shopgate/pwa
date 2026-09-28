import { combineReducers } from 'redux';
import reviewsByHash from './reviewsByHash';
import reviewsById from './reviewsById';
import reviewsByProductId from './reviewsByProductId';
import userReviewsByProductId from './userReviewsByProductId';
import reviewSettings from './reviewSettings';

export default combineReducers({
  reviewsByHash,
  reviewsById,
  reviewsByProductId,
  userReviewsByProductId,
  reviewSettings,
});
