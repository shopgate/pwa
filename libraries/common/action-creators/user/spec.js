import {
  requestLogin,
  successLogin,
  errorLogin,
  requestLogout,
  successLogout,
  errorLogout,
  requestUser,
  receiveUser,
  errorUser,
  toggleLoggedIn,
} from './index';
import {
  REQUEST_LOGIN,
  SUCCESS_LOGIN,
  ERROR_LOGIN,
  REQUEST_LOGOUT,
  SUCCESS_LOGOUT,
  ERROR_LOGOUT,
  REQUEST_USER,
  RECEIVE_USER,
  ERROR_USER,
  TOGGLE_LOGGED_IN,
} from '../../constants/ActionTypes';
import { DEFAULT_LOGIN_STRATEGY } from '../../constants/user';

const messages = [{
  type: 'EUNKNOWN',
  message: 'Something went wrong',
  code: 1337,
}];

describe('Action Creators: user', () => {
  describe('requestLogin()', () => {
    it('should work as expected', () => {
      const user = 'super@user.com';
      const password = 'super#password';
      const expected = {
        type: REQUEST_LOGIN,
        user,
        password,
        strategy: DEFAULT_LOGIN_STRATEGY,
      };
      expect(requestLogin(user, password)).toEqual(expected);
    });
  });

  describe('successLogin()', () => {
    it('should work as expected with no parameters', () => {
      const expected = {
        type: SUCCESS_LOGIN,
        redirect: undefined,
        strategy: DEFAULT_LOGIN_STRATEGY,
      };
      expect(successLogin()).toEqual(expected);
    });

    it('should work as expected with parameters', () => {
      const redirect = '/some/url';
      const strategy = 'custom';
      const expected = {
        type: SUCCESS_LOGIN,
        redirect,
        strategy,
      };
      expect(successLogin(redirect, strategy)).toEqual(expected);
    });
  });

  describe('errorLogin()', () => {
    it('should work as expected', () => {
      const expected = {
        type: ERROR_LOGIN,
        code: 'EUNKNOWN',
        messages,
      };
      expect(errorLogin(messages, 'EUNKNOWN')).toEqual(expected);
    });

    it('should work as expected when the messages parameter is empty', () => {
      const expected = {
        type: ERROR_LOGIN,
        code: 'EUNKNOWN',
        messages: [],
      };
      expect(errorLogin(undefined, 'EUNKNOWN')).toEqual(expected);
    });

    it('should work as expected when the code paramter is empty', () => {
      const expected = {
        type: ERROR_LOGIN,
        code: '',
        messages,
      };
      expect(errorLogin(messages)).toEqual(expected);
    });
  });

  describe('requestLogout()', () => {
    it('should work as expected', () => {
      const expected = { type: REQUEST_LOGOUT };
      expect(requestLogout()).toEqual(expected);
    });
  });

  describe('successLogout()', () => {
    it('should work as expected', () => {
      const expected = { type: SUCCESS_LOGOUT };
      expect(successLogout()).toEqual(expected);
    });
  });

  describe('errorLogout()', () => {
    it('should work as expected', () => {
      const expected = {
        type: ERROR_LOGOUT,
        messages,
      };
      expect(errorLogout(messages)).toEqual(expected);
    });

    it('should work as expected when the messages parameter is empty', () => {
      const expected = {
        type: ERROR_LOGOUT,
        messages: [],
      };
      expect(errorLogout()).toEqual(expected);
    });
  });

  describe('requestUser()', () => {
    it('should work as expected', () => {
      const expected = { type: REQUEST_USER };
      expect(requestUser()).toEqual(expected);
    });
  });

  describe('receiveUser()', () => {
    it('should work as expected', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        mail: 'john@doe.com',
      };
      const expected = {
        type: RECEIVE_USER,
        user,
      };
      expect(receiveUser(user)).toEqual(expected);
    });
  });

  describe('errorUser()', () => {
    it('should work as expected', () => {
      const err = new Error();
      // eslint-disable-next-line extra-rules/no-single-line-objects
      const expected = { type: ERROR_USER, error: err };
      expect(errorUser(err)).toEqual(expected);
    });
  });

  describe('toggleLoggedIn()', () => {
    it('should toggle to true', () => {
      const expected = {
        type: TOGGLE_LOGGED_IN,
        value: true,
      };
      expect(toggleLoggedIn(true)).toEqual(expected);
    });

    it('should toggle to false', () => {
      const expected = {
        type: TOGGLE_LOGGED_IN,
        value: false,
      };
      expect(toggleLoggedIn(false)).toEqual(expected);
    });
  });
});
