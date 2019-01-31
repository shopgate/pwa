import { connect } from 'react-redux';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';

/**
 * @param {Function} dispatch The redux dispatch function
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  showModal: options => dispatch(showModal({
    confirm: 'modal.ok',
    dismiss: null,
    ...options,
  })),
});

export default connect(null, mapDispatchToProps);
