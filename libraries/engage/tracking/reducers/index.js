import { combineReducers } from 'redux';
import cookieConsentModal from './cookieConsentModal';
import cookieSettings from './cookieSettings';

export default combineReducers({
  cookieConsentModal,
  cookieSettings,
});
