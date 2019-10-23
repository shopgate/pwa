import { mutable } from '@shopgate/pwa-common/helpers/redux';
import flushUserReviewAction from '../action-creators/flushUserReview';

/** @mixes {MutableFunction} */
export default mutable(() => dispatch => dispatch(flushUserReviewAction()));
