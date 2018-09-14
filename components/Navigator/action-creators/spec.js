import * as actions from './index';
import * as types from '../constants';

describe('Navigator Actions', () => {
  it('should create the action "toggleNavigator"', () => {
    const visible = true;
    const action = {
      type: types.TOGGLE_NAVIGATOR,
      visible,
    };

    expect(actions.toggleNavigator(visible)).toEqual(action);
  });

  it('should create the action "toggleNavigatorCart"', () => {
    const visible = true;
    const action = {
      type: types.TOGGLE_NAVIGATOR_CART,
      visible,
    };

    expect(actions.toggleNavigatorCart(visible)).toEqual(action);
  });

  it('should create the action "toggleNavigatorSearch"', () => {
    const visible = true;
    const action = {
      type: types.TOGGLE_NAVIGATOR_SEARCH,
      visible,
    };

    expect(actions.toggleNavigatorSearch(visible)).toEqual(action);
  });

  it('should create the action "toggleNavigatorTitle"', () => {
    const visible = true;
    const action = {
      type: types.TOGGLE_NAVIGATOR_TITLE,
      visible,
    };

    expect(actions.toggleNavigatorTitle(visible)).toEqual(action);
  });

  it('should create the action "toggleProgressBar"', () => {
    const visible = true;
    const action = {
      type: types.TOGGLE_PROGRESSBAR,
      visible,
    };

    expect(actions.toggleProgressBar(visible)).toEqual(action);
  });

  it('should create the action "setNavigatorBackgroundColor"', () => {
    const color = 'red';
    const action = {
      type: types.SET_NAVIGATOR_BACKGROUND,
      color,
    };

    expect(actions.setNavigatorBackgroundColor(color)).toEqual(action);
  });

  it('should create the action "setNavigatorTextColor"', () => {
    const color = 'red';
    const action = {
      type: types.SET_NAVIGATOR_COLOR,
      color,
    };

    expect(actions.setNavigatorTextColor(color)).toEqual(action);
  });
});
