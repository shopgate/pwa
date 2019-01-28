import { connect } from 'react-redux';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';

/**
 * @param {function} dispatch dispatch
 * @return {{showModal: function}}.
 */
const mapDispatchToProps = dispatch => ({
  showModal: options => dispatch(showModal({
    confirm: 'modal.ok',
    dismiss: null,
    ...options,
  })),
});

export default connect(null, mapDispatchToProps);
