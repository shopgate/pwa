import { connect } from 'react-redux';
import {
  getAreComfortCookiesAccepted,
  getAreStatisticsCookiesAccepted,
} from '@shopgate/engage/tracking/selectors';
import { historyPush } from '../../actions/router';

/**
 * Maps the current application state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The populated component props.
 */
const mapStateToProps = state => ({
  comfortCookiesAccepted: getAreComfortCookiesAccepted(state),
  statisticsCookiesAccepted: getAreStatisticsCookiesAccepted(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: (pathname, target) => dispatch(historyPush({
    pathname,
    ...target && { state: { target } },
  })),
});

export default connect(mapStateToProps, mapDispatchToProps);
